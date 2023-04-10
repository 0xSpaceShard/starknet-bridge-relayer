import { WithdrawalDoc } from './interfaces';
import { ethers, BigNumber } from 'ethers';
import { decodeBSONFile, getMessageHash } from './utils';
import { l2BridgeAddressToL1 } from '../../src/relayer/relayer.constants';
import { Starknet, Starknet__factory } from '../starknet-core/typechain-types';
import { ADDRESSES } from '../../src/web3/web3.constants';
import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { RelayerService } from '../../src/relayer/relayer.service';
import { RelayerModule } from '../../src/relayer/relayer.module';
import { ContractAddress } from '../../src/web3/web3.interface';
import { ConfigService } from '../../src/common/config';
import { MongoService } from '../../src/storage/mongo/mongo.service';
import { IndexerService } from 'indexer/indexer.service';

dotenv.config();
jest.useRealTimers();

describe('Relayer (e2e)', () => {
  let relayerService: RelayerService;
  let configService: ConfigService;
  let mongoService: MongoService;
  let moduleFixture: TestingModule;
  let signer: ethers.Wallet;
  let l2BridgeAddressToL1Addresses: any;
  let coreAddresses: ContractAddress;
  let provider: ethers.providers.JsonRpcProvider;
  let starknet: Starknet;
  let indexerService: IndexerService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [RelayerModule],
    }).compile();
    relayerService = moduleFixture.get<RelayerService>(RelayerService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    mongoService = moduleFixture.get<MongoService>(MongoService);
    indexerService = moduleFixture.get<IndexerService>(IndexerService);

    provider = new ethers.providers.JsonRpcProvider('http://hardhat:8545');
    const privateKey = process.env.PRIVATE_KEY;
    const network = process.env.NETWORK_ID;
    signer = new ethers.Wallet(privateKey, provider);
    l2BridgeAddressToL1Addresses = l2BridgeAddressToL1(network);
    coreAddresses = ADDRESSES[network];

    starknet = Starknet__factory.connect(coreAddresses.starknetCore, signer) as Starknet;
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('Consume valid transactions', async () => {
    const fromBlock = 786000;
    const toBlock = 786008;
    const stateBlock = 786250;
    const docs = 14;

    await starknet.setStateBlockNumber(stateBlock);

    const withdrawals: WithdrawalDoc[] = decodeBSONFile(
      './e2e/data/dump/starknet_bridge_indexer/withdraw.bson',
      docs,
      0,
    );

    const allMessageHashes = [];
    const validMessageHashes = [];
    const invalidMessageHashes = [];
    const usersAddresses = [];
    const userBalancesBefore: Array<BigNumber> = [];
    const userExpectedAmountToReceive: any = {};

    // Add messages to Starknet core contract, add only the `withdrawals.length / 2`
    {
      for (let i = 0; i < docs; i++) {
        const withdraw = withdrawals[i];
        const l1Recipient = withdraw.l1_recipient.toString('hex').replace('000000000000000000000000', '0x');
        const l2BridgeAddress = withdraw.bridge_address.toString('hex');
        const l1BridgeAddress = l2BridgeAddressToL1Addresses[l2BridgeAddress].l1BridgeAddress;
        const amount = BigNumber.from('0x' + withdraw.amount.toString('hex'));

        const msgHash = getMessageHash(l2BridgeAddress, l1BridgeAddress, l1Recipient, amount.toString());
        allMessageHashes.push(msgHash);

        if (Math.floor(Math.random() * 100) > 50) {
          validMessageHashes.push(msgHash);
          userBalancesBefore.push(await provider.getBalance(l1Recipient));
          usersAddresses.push(l1Recipient);
          if (!userExpectedAmountToReceive[l1Recipient]) {
            userExpectedAmountToReceive[l1Recipient] = amount;
          } else {
            userExpectedAmountToReceive[l1Recipient] = userExpectedAmountToReceive[l1Recipient].add(amount);
          }
        } else {
          invalidMessageHashes.push(msgHash);
        }
      }

      await starknet.connect(signer).deleteMessage(allMessageHashes);
      await starknet.connect(signer).addMessage(validMessageHashes);

      for (let i = 0; i < validMessageHashes.length; i++) {
        expect((await starknet.l2ToL1Messages(validMessageHashes[i])).toNumber()).toBeGreaterThan(0);
      }
    }

    // Process transactions
    const processWithdrawalsResult = await relayerService.processWithdrawals(fromBlock, toBlock, stateBlock);
    if (docs > 50) {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(toBlock - 50);
    } else {
      expect(processWithdrawalsResult.currentFromBlockNumber).toEqual(fromBlock);
    }
    expect(processWithdrawalsResult.currentToBlockNumber).toEqual(toBlock);
    expect(processWithdrawalsResult.stateBlockNumber).toEqual(stateBlock);
    expect(processWithdrawalsResult.totalWithdrawals).toEqual(withdrawals.length);
    expect(processWithdrawalsResult.totalWithdrawalsProcessed).toEqual(validMessageHashes.length);

    // Get users balances after processing the transactions
    const userBalancesAfter: Array<BigNumber> = [];
    for (let i = 0; i < validMessageHashes.length; i++) {
      userBalancesAfter.push(await provider.getBalance(usersAddresses[i]));
    }

    for (let i = 0; i < userBalancesAfter.length; i++) {
      expect(userBalancesAfter[i].sub(userBalancesBefore[i])).toEqual(userExpectedAmountToReceive[usersAddresses[i]]);
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
});
