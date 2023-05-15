import { Injectable } from '@nestjs/common';
import {
  StarknetCore,
  StarknetTokenBridge,
  StarknetCore__factory,
  StarknetTokenBridge__factory,
  MulticallWithGasLimit__factory,
  MulticallWithGasLimit,
  Multicall,
  Multicall__factory,
} from './generated';
import { ADDRESSES, GAS_BUFFER_PER_WITHDRAWAL, getProviderURLs } from './web3.constants';
import { ConfigService } from 'common/config';
import { BigNumber, ethers } from 'ethers';
import { BaseFeePerGasHistory, ContractAddress, MulticallRequest, Provider } from './web3.interface';
import * as StarknetCoreABI from './abis/StarknetCore.json';
import * as StarknetTokenBridgeABI from './abis/StarknetTokenBridge.json';

@Injectable()
export class Web3Service {
  maxPriorityFeePerGas: number;
  constructor(private configService: ConfigService) {
    this.maxPriorityFeePerGas = this.configService.get('MAX_PRIORITY_FEE_PER_GAS');
  }

  async getMulticallWithGasLimitContract(): Promise<MulticallWithGasLimit> {
    const provider = await this.getProvider();
    return MulticallWithGasLimit__factory.connect(this.getAddresses().multicallGasLimit, provider);
  }

  async getMulticallContract(): Promise<Multicall> {
    const provider = await this.getProvider();
    return Multicall__factory.connect(this.getAddresses().multicall, provider);
  }

  async getStarknetCoreContract(): Promise<StarknetCore> {
    const provider = await this.getProvider();
    return StarknetCore__factory.connect(this.getAddresses().starknetCore, provider);
  }

  async getStarknetTokenBridgeContract(bridgeAddress: string): Promise<StarknetTokenBridge> {
    const provider = await this.getProvider();
    return StarknetTokenBridge__factory.connect(bridgeAddress, provider);
  }

  async callWithdrawMulticall(multicallRequests: Array<MulticallRequest>) {
    const multicall = await this.getMulticallWithGasLimitContract();
    const length = multicallRequests.length;

    let gasLimit = BigNumber.from('0');

    for (let index = 0; index < length; index++) {
      const req = multicallRequests[index];
      gasLimit = gasLimit.add(BigNumber.from(req.gas));
    }

    gasLimit = gasLimit.add(GAS_BUFFER_PER_WITHDRAWAL * multicallRequests.length);

    return await multicall.tryAggregate(false, multicallRequests, { gasLimit });
  }

  async callWithdraw(bridgeAddress: string, amount: BigNumber, receiverL1: string, gasLimit: number) {
    const starknetTokenBridge = await this.getStarknetTokenBridgeContract(bridgeAddress);
    return await starknetTokenBridge.withdraw(amount, receiverL1, { gasLimit });
  }

  async canConsumeMessageOnL1MulticallView(multicallRequests: Array<MulticallRequest>) {
    const multicallView = await this.getMulticallContract();
    return await multicallView.callStatic.tryAggregate(false, multicallRequests);
  }

  async getStateBlockNumber(): Promise<BigNumber> {
    const starknetCore = await this.getStarknetCoreContract();
    return await starknetCore.stateBlockNumber();
  }

  encodeCalldataStarknetCore = (functionName: string, params: any[]): string => {
    let iface = new ethers.utils.Interface(StarknetCoreABI);
    return iface.encodeFunctionData(functionName, params);
  };

  encodeBridgeToken = (functionName: string, params: any[]): string => {
    let iface = new ethers.utils.Interface(StarknetTokenBridgeABI);
    return iface.encodeFunctionData(functionName, params);
  };

  fetchBaseFeePriceHistory = async (blockNumber: number, numberOfBlocks: number): Promise<BaseFeePerGasHistory> => {
    const provider = (await this.getProvider()).provider as ethers.providers.JsonRpcProvider;
    const baseFeePerGasHistoryList: BaseFeePerGasHistory = await provider.send('eth_feeHistory', [
      numberOfBlocks,
      BigNumber.from(blockNumber).toHexString().replace('0x0', '0x'),
      [],
    ]);
    return baseFeePerGasHistoryList;
  };

  getCurrentBlockNumber = async (): Promise<number> => {
    const provider = (await this.getProvider()).provider as ethers.providers.JsonRpcProvider;
    return await provider.getBlockNumber();
  };

  getCurrentGasPrice = async (): Promise<BigNumber> => {
    const provider = (await this.getProvider()).provider as ethers.providers.JsonRpcProvider;
    return await provider.getGasPrice();
  };

  getRelayerL1Balance = async (): Promise<BigNumber> => {
    const wallet = await this.getProvider();
    return await wallet.provider.getBalance(wallet.address);
  };

  async getProvider() {
    const providerURLs: Array<Provider> = getProviderURLs(this.configService);
    for (let i = 0; i < providerURLs.length; i++) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(providerURLs[i].url);
        await provider.getBlockNumber();
        return new ethers.Wallet(this.configService.get('PRIVATE_KEY'), provider);
      } catch (error: any) {
        continue;
      }
    }
    throw 'Invalid providers';
  }

  getAddresses(): ContractAddress {
    return ADDRESSES[this.configService.get('NETWORK_ID')];
  }
}
