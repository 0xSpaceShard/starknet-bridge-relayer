import { BigNumber } from 'ethers';

export interface NetworkContractAddress {
  mainnet: ContractAddress;
  goerli: ContractAddress;
}

export interface ContractAddress {
  multicall: string;
  multicallGasLimit: string;
  starknetCore: string;
}

export interface Provider {
  name: string;
  url: string;
}

export interface MulticallRequest {
  target: string;
  callData: string;
  gas: string
}

export interface MulticallResponse {
  success: boolean;
  returnData: string;
}

export interface BaseFeePerGasHistory {
  oldestBlock: string;
  baseFeePerGas: Array<String>;
  gasUsedRatio: Array<Number>;
}
