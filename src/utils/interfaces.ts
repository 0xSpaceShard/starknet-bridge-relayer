export interface ListL1ToL2Bridges {
  [key: string]: string;
}

export interface ListBridgeMetadata {
  [key: string]: BridgeMetadata;
}

export interface BridgeMetadata {
  name: string;
  symbol: string;
  decimals: number;
  l1TokenAddress: string;
  l2TokenAddress: string;
  l1BridgeAddress: string;
  gas: string;
}
