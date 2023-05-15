import { WithdrawalDoc } from './interfaces';
import { ethers, BigNumber } from 'ethers';
import { decodeBSONFile, getMessageHash } from './utils';
import { MinimumEthBalance, NumberOfWithdrawalsToProcessPerTransaction } from '../../src/relayer/relayer.constants';
import { IERC20, IERC20__factory, Starknet, Starknet__factory } from '../starknet-core/typechain-types';
import { ADDRESSES, GAS_BUFFER_PER_WITHDRAWAL } from '../../src/web3/web3.constants';
import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { RelayerService } from '../../src/relayer/relayer.service';
import { RelayerModule } from '../../src/relayer/relayer.module';
import { BaseFeePerGasHistory, ContractAddress } from '../../src/web3/web3.interface';
import { ConfigService } from '../../src/common/config';
import { MongoService } from '../../src/storage/mongo/mongo.service';
import { IndexerService } from '../../src/indexer/indexer.service';
import { Web3Service } from '../../src/web3/web3.service';
import { sleep } from 'relayer/relayer.utils';
import { networkListBridgeMetadata } from 'utils/bridgeTokens';
import { ListBridgeMetadata } from 'utils/interfaces';

dotenv.config();
jest.useRealTimers();

describe('Relayer (e2e)', () => {
  let relayerService: RelayerService;
  let configService: ConfigService;
  let mongoService: MongoService;
  let moduleFixture: TestingModule;
  let signer: ethers.Wallet;
  let listBridgeMetadata: ListBridgeMetadata;
  let coreAddresses: ContractAddress;
  let provider: ethers.providers.JsonRpcProvider;
  let starknet: Starknet;
  let indexerService: IndexerService;
  let web3Service: Web3Service;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [RelayerModule],
    }).compile();
    relayerService = moduleFixture.get<RelayerService>(RelayerService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    mongoService = moduleFixture.get<MongoService>(MongoService);
    indexerService = moduleFixture.get<IndexerService>(IndexerService);
    web3Service = moduleFixture.get<Web3Service>(Web3Service);

    provider = new ethers.providers.JsonRpcProvider('http://hardhat:8545');
    const privateKey = process.env.PRIVATE_KEY;
    const network = "goerli";
    signer = new ethers.Wallet(privateKey, provider);
    listBridgeMetadata = networkListBridgeMetadata(network);
    coreAddresses = ADDRESSES[network];

    starknet = Starknet__factory.connect(coreAddresses.starknetCore, signer) as Starknet;
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('Consume valid multiple transactions', async () => {
    jest.spyOn(web3Service, 'getCurrentGasPrice').mockReturnValue(Promise.resolve(BigNumber.from('1000000000')));
    // const fromBlock = 786000;
    // const toBlock = 786500;
    // const stateBlock = 786550;
    // const docs = 694;

    // const fromBlock = 786000;
    // const toBlock = 786200;
    // const stateBlock = 786250;
    // const docs = 356;

    const fromBlock = 786000;
    const toBlock = 786008;
    const stateBlock = 786250;
    const docs = 14;
    // Number of users paid the correct amount to the relayer
    const expectedNumberOfValidTransactions = 3;

    // const fromBlock = 786000;
    // const toBlock = 786001;
    // const stateBlock = 786250;
    // const docs = 3;

    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementation(async (blockNumber: number, numberOfBlocks: number): Promise<BaseFeePerGasHistory> => {
        const provider = new ethers.providers.JsonRpcProvider(configService.get('INFURA_RPC_URL'));
        const baseFeePerGasHistoryList: BaseFeePerGasHistory = await provider.send('eth_feeHistory', [
          numberOfBlocks,
          BigNumber.from(blockNumber).toHexString(),
          [],
        ]);
        return baseFeePerGasHistoryList;
      });

    await starknet.setStateBlockNumber(stateBlock);

    const withdrawals: WithdrawalDoc[] = decodeBSONFile(
      './e2e/data/dump/starknet_bridge_indexer/withdraw.bson',
      docs,
      0,
    );

    const allMessageHashes = [];
    const validMessageHashes = [];
    const usersAddresses = [];
    const userBalancesBefore = [];
    const userExpectedAmountToReceive: any = {};
    let numberOfUsersToCheckBalanced = 10; // to avoid rate limiting

    {
      for (let i = 0; i < docs; i++) {
        const withdraw = withdrawals[i];
        const l1Recipient = withdraw.l1_recipient.toString('hex').replace('000000000000000000000000', '0x');
        const l2BridgeAddress = withdraw.bridge_address.toString('hex');
        const l1BridgeAddress = listBridgeMetadata[l2BridgeAddress].l1BridgeAddress;
        const amount = BigNumber.from('0x' + withdraw.amount.toString('hex'));

        const msgHash = getMessageHash(l2BridgeAddress, l1BridgeAddress, l1Recipient, amount.toString());
        allMessageHashes.push(msgHash);

        validMessageHashes.push(msgHash);
        if (i < numberOfUsersToCheckBalanced) {
          if (l2BridgeAddress == '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82') {
            await sleep(1000);
            userBalancesBefore.push(await provider.getBalance(l1Recipient));
            usersAddresses.push({ erc20: false, l1Recipient });
          } else {
            const add = listBridgeMetadata[l2BridgeAddress].l1TokenAddress;
            await sleep(1000);
            const erc20 = IERC20__factory.connect(add, signer) as IERC20;
            const balance = await erc20.balanceOf(l1Recipient);
            userBalancesBefore.push(balance.toString());
            usersAddresses.push({ erc20: true, l1Recipient, erc20address: add });
          }
        }
        if (!userExpectedAmountToReceive[l1Recipient]) {
          userExpectedAmountToReceive[l1Recipient] = amount;
        } else {
          userExpectedAmountToReceive[l1Recipient] = userExpectedAmountToReceive[l1Recipient].add(amount);
        }
      }

      await starknet.connect(signer).deleteMessage(allMessageHashes);
      await starknet.connect(signer).addMessage(validMessageHashes);
    }
    // Process transactions
    const processWithdrawalsResult = await relayerService.processWithdrawals(fromBlock, toBlock, stateBlock);
    if (docs > NumberOfWithdrawalsToProcessPerTransaction) {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(
        toBlock - NumberOfWithdrawalsToProcessPerTransaction,
      );
    } else {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(fromBlock);
    }
    expect(processWithdrawalsResult.currentToBlockNumber).toEqual(toBlock);
    expect(processWithdrawalsResult.stateBlockNumber).toEqual(stateBlock);
    expect(processWithdrawalsResult.totalWithdrawals).toEqual(withdrawals.length);
    expect(processWithdrawalsResult.totalWithdrawalsProcessed).toEqual(expectedNumberOfValidTransactions);

    // Get users balances after processing the transactions
    const userBalancesAfter: Array<BigNumber> = [];
    for (let i = 0; i < usersAddresses.length; i++) {
      if (usersAddresses[i].erc20) {
        const erc20 = IERC20__factory.connect(usersAddresses[i].erc20address, signer) as IERC20;
        const balance = await erc20.balanceOf(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      } else {
        const balance = await provider.getBalance(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      }
    }

    for (let i = 0; i < userBalancesAfter.length; i++) {
      if (userBalancesAfter[i].eq(userBalancesBefore[i])) continue;
      expect(userBalancesAfter[i].sub(userBalancesBefore[i])).toEqual(
        userExpectedAmountToReceive[usersAddresses[i].l1Recipient],
      );
    }
    expect((await mongoService.getLastProcessedBlock()).blockNumber).toEqual(toBlock);
  });

  it('Consume valid single transactions', async () => {
    const fromBlock = 786001;
    const toBlock = 786002;
    const stateBlock = 786250;
    const docs = 1;

    jest
      .spyOn(relayerService, 'checkIfAmountPaidIsValid')
      .mockReturnValue(Promise.resolve({ status: true, amount: ethers.utils.parseEther('1') }));
    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementation(async (blockNumber: number, numberOfBlocks: number): Promise<BaseFeePerGasHistory> => {
        const provider = new ethers.providers.JsonRpcProvider(configService.get('INFURA_RPC_URL'));
        const baseFeePerGasHistoryList: BaseFeePerGasHistory = await provider.send('eth_feeHistory', [
          numberOfBlocks,
          BigNumber.from(blockNumber).toHexString(),
          [],
        ]);
        return baseFeePerGasHistoryList;
      });

    await starknet.setStateBlockNumber(stateBlock);

    const withdrawals: WithdrawalDoc[] = decodeBSONFile(
      './e2e/data/dump/starknet_bridge_indexer/withdraw.bson',
      docs,
      0,
    );

    const allMessageHashes = [];
    const validMessageHashes = [];
    const usersAddresses = [];
    const userBalancesBefore = [];
    const userExpectedAmountToReceive: any = {};
    let numberOfUsersToCheckBalanced = 1; // to avoid rate limiting

    {
      for (let i = 0; i < docs; i++) {
        const withdraw = withdrawals[i];
        const l1Recipient = withdraw.l1_recipient.toString('hex').replace('000000000000000000000000', '0x');
        const l2BridgeAddress = withdraw.bridge_address.toString('hex');
        const l1BridgeAddress = listBridgeMetadata[l2BridgeAddress].l1BridgeAddress;
        const amount = BigNumber.from('0x' + withdraw.amount.toString('hex'));

        const msgHash = getMessageHash(l2BridgeAddress, l1BridgeAddress, l1Recipient, amount.toString());
        allMessageHashes.push(msgHash);

        validMessageHashes.push(msgHash);
        if (i < numberOfUsersToCheckBalanced) {
          if (l2BridgeAddress == '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82') {
            await sleep(1000);
            userBalancesBefore.push(await provider.getBalance(l1Recipient));
            usersAddresses.push({ erc20: false, l1Recipient });
          } else {
            const add = listBridgeMetadata[l2BridgeAddress].l1TokenAddress;
            await sleep(1000);
            const erc20 = IERC20__factory.connect(add, signer) as IERC20;
            const balance = await erc20.balanceOf(l1Recipient);
            userBalancesBefore.push(balance.toString());
            usersAddresses.push({ erc20: true, l1Recipient, erc20address: add });
          }
        }
        if (!userExpectedAmountToReceive[l1Recipient]) {
          userExpectedAmountToReceive[l1Recipient] = amount;
        } else {
          userExpectedAmountToReceive[l1Recipient] = userExpectedAmountToReceive[l1Recipient].add(amount);
        }
      }

      await starknet.connect(signer).deleteMessage(allMessageHashes);
      await starknet.connect(signer).addMessage(validMessageHashes);
    }
    // Process transactions
    const processWithdrawalsResult = await relayerService.processWithdrawals(fromBlock, toBlock, stateBlock);
    if (docs > NumberOfWithdrawalsToProcessPerTransaction) {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(
        toBlock - NumberOfWithdrawalsToProcessPerTransaction,
      );
    } else {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(fromBlock);
    }
    expect(processWithdrawalsResult.currentToBlockNumber).toEqual(toBlock);
    expect(processWithdrawalsResult.stateBlockNumber).toEqual(stateBlock);
    expect(processWithdrawalsResult.totalWithdrawals).toEqual(docs);
    expect(processWithdrawalsResult.totalWithdrawalsProcessed).toEqual(docs);

    // Get users balances after processing the transactions
    const userBalancesAfter: Array<BigNumber> = [];
    for (let i = 0; i < usersAddresses.length; i++) {
      if (usersAddresses[i].erc20) {
        const erc20 = IERC20__factory.connect(usersAddresses[i].erc20address, signer) as IERC20;
        const balance = await erc20.balanceOf(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      } else {
        const balance = await provider.getBalance(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      }
    }

    for (let i = 0; i < userBalancesAfter.length; i++) {
      if (userBalancesAfter[i].eq(userBalancesBefore[i])) continue;
      expect(userBalancesAfter[i].sub(userBalancesBefore[i])).toEqual(
        userExpectedAmountToReceive[usersAddresses[i].l1Recipient],
      );
    }
    expect((await mongoService.getLastProcessedBlock()).blockNumber).toEqual(toBlock);
  });

  it('Check if canProcessWithdrawals', async () => {
    const stateBlock = 787050;
    const fromBlock = 786000;
    await starknet.setStateBlockNumber(stateBlock);
    await mongoService.updateProcessedBlock(786000);
    const toBlock = await indexerService.getLastIndexedBlock();
    const res = await relayerService.canProcessWithdrawals();
    expect(res.fromBlock).toEqual(fromBlock);
    expect(res.toBlock).toEqual(toBlock);
    expect(res.stateBlockNumber).toEqual(stateBlock);
  });

  it('calculate gas cost', async () => {
    const msgHash = '0x0e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e4be';
    await starknet.addMessage([msgHash, msgHash]);
    expect((await starknet.l2ToL1Messages(msgHash)).toNumber()).not.toEqual(0);
    const hashes = [
      {
        callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e4be',
        target: '0xde29d060D45901Fb19ED6C6e959EB22d8626708e',
        gas: '100000'
      },
      {
        callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e4be',
        target: '0xde29d060D45901Fb19ED6C6e959EB22d8626708e',
        gas: '100000'
      },
    ];
    let tx = await web3Service.callWithdrawMulticall(hashes);

    expect(tx.gasLimit.toNumber()).toEqual(200000 + GAS_BUFFER_PER_WITHDRAWAL * hashes.length);
    let receipt = await provider.getTransactionReceipt(tx.hash);
    expect(receipt.gasUsed.toNumber()).toBeLessThan(Number(hashes[0].gas));

    await starknet.addMessage([msgHash]);
    expect((await starknet.l2ToL1Messages(msgHash)).toNumber()).not.toEqual(0);
    tx = await web3Service.callWithdrawMulticall([hashes[0]]);

    expect(tx.gasLimit.toNumber()).toEqual(Number(hashes[0].gas)+ GAS_BUFFER_PER_WITHDRAWAL);
    receipt = await provider.getTransactionReceipt(tx.hash);
    expect(receipt.gasUsed.toNumber()).toBeLessThan(Number(hashes[0].gas) + GAS_BUFFER_PER_WITHDRAWAL);
  });

  it('Consume valid multiple transactions when the paid fees can not cover the gas cost', async () => {
    const fromBlock = 786000;
    const toBlock = 786008;
    const stateBlock = 786250;
    const docs = 14;
    const expectedNumberOfValidTransactions = 3;

    jest.spyOn(web3Service, 'getCurrentGasPrice').mockReturnValue(Promise.resolve(BigNumber.from('1000000000000')));
    jest
      .spyOn(web3Service, 'fetchBaseFeePriceHistory')
      .mockImplementation(async (blockNumber: number, numberOfBlocks: number): Promise<BaseFeePerGasHistory> => {
        const provider = new ethers.providers.JsonRpcProvider(configService.get('INFURA_RPC_URL'));
        const baseFeePerGasHistoryList: BaseFeePerGasHistory = await provider.send('eth_feeHistory', [
          numberOfBlocks,
          BigNumber.from(blockNumber).toHexString(),
          [],
        ]);
        return baseFeePerGasHistoryList;
      });

    await starknet.setStateBlockNumber(stateBlock);

    const withdrawals: WithdrawalDoc[] = decodeBSONFile(
      './e2e/data/dump/starknet_bridge_indexer/withdraw.bson',
      docs,
      0,
    );

    const allMessageHashes = [];
    const validMessageHashes = [];
    const usersAddresses = [];
    const userBalancesBefore = [];
    const userExpectedAmountToReceive: any = {};
    let numberOfUsersToCheckBalanced = 10; // to avoid rate limiting

    {
      for (let i = 0; i < docs; i++) {
        const withdraw = withdrawals[i];
        const l1Recipient = withdraw.l1_recipient.toString('hex').replace('000000000000000000000000', '0x');
        const l2BridgeAddress = withdraw.bridge_address.toString('hex');
        const l1BridgeAddress = listBridgeMetadata[l2BridgeAddress].l1BridgeAddress;
        const amount = BigNumber.from('0x' + withdraw.amount.toString('hex'));

        const msgHash = getMessageHash(l2BridgeAddress, l1BridgeAddress, l1Recipient, amount.toString());
        allMessageHashes.push(msgHash);

        validMessageHashes.push(msgHash);
        if (i < numberOfUsersToCheckBalanced) {
          if (l2BridgeAddress == '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82') {
            await sleep(1000);
            userBalancesBefore.push(await provider.getBalance(l1Recipient));
            usersAddresses.push({ erc20: false, l1Recipient });
          } else {
            const add = listBridgeMetadata[l2BridgeAddress].l1TokenAddress;
            await sleep(1000);
            const erc20 = IERC20__factory.connect(add, signer) as IERC20;
            const balance = await erc20.balanceOf(l1Recipient);
            userBalancesBefore.push(balance.toString());
            usersAddresses.push({ erc20: true, l1Recipient, erc20address: add });
          }
        }
        if (!userExpectedAmountToReceive[l1Recipient]) {
          userExpectedAmountToReceive[l1Recipient] = amount;
        } else {
          userExpectedAmountToReceive[l1Recipient] = userExpectedAmountToReceive[l1Recipient].add(amount);
        }
      }

      await starknet.connect(signer).deleteMessage(allMessageHashes);
      await starknet.connect(signer).addMessage(validMessageHashes);
    }

    // Try to consume the withdrawals but it fails because the network fee is high
    try {
      await relayerService.processWithdrawals(fromBlock, toBlock, stateBlock);
    } catch (error) {
      expect(error).toEqual(new Error('The total gas cost paid can not cover the transaction cost, sleep'));
    }

    jest.spyOn(web3Service, 'getCurrentGasPrice').mockReturnValue(Promise.resolve(BigNumber.from('1000000000')));
    const processWithdrawalsResult = await relayerService.processWithdrawals(fromBlock, toBlock, stateBlock);

    if (docs > NumberOfWithdrawalsToProcessPerTransaction) {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(
        toBlock - NumberOfWithdrawalsToProcessPerTransaction,
      );
    } else {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(fromBlock);
    }
    expect(processWithdrawalsResult.currentToBlockNumber).toEqual(toBlock);
    expect(processWithdrawalsResult.stateBlockNumber).toEqual(stateBlock);
    expect(processWithdrawalsResult.totalWithdrawals).toEqual(withdrawals.length);
    expect(processWithdrawalsResult.totalWithdrawalsProcessed).toEqual(expectedNumberOfValidTransactions);

    // Get users balances after processing the transactions
    const userBalancesAfter: Array<BigNumber> = [];
    for (let i = 0; i < usersAddresses.length; i++) {
      if (usersAddresses[i].erc20) {
        const erc20 = IERC20__factory.connect(usersAddresses[i].erc20address, signer) as IERC20;
        const balance = await erc20.balanceOf(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      } else {
        const balance = await provider.getBalance(usersAddresses[i].l1Recipient);
        userBalancesAfter.push(balance);
      }
    }

    for (let i = 0; i < userBalancesAfter.length; i++) {
      if (userBalancesAfter[i].eq(userBalancesBefore[i])) continue;
      expect(userBalancesAfter[i].sub(userBalancesBefore[i])).toEqual(
        userExpectedAmountToReceive[usersAddresses[i].l1Recipient],
      );
    }
    expect((await mongoService.getLastProcessedBlock()).blockNumber).toEqual(toBlock);
  });

  it('Check the relayer balance', async () => {
    const wallet = await web3Service.getProvider()
    const balance = await wallet.getBalance()

    if (balance.gt(MinimumEthBalance)) {
      await wallet.sendTransaction({
        to: ethers.constants.AddressZero,
        value: balance.sub("90000000000000000").toHexString()
      })
    }

    await relayerService.checkRelayerBalance()
  })
});
