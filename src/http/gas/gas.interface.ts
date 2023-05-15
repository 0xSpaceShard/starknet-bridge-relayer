export interface EtherscanGetBlockNumberTimestampResponse {
  status: string;
  message: string;
  result: string;
}

export interface FeeHistory {
  lastBlock: number;
  oldBlock: number;
  baseFees: Array<String>;
}
