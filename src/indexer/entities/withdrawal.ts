export interface Withdrawal {
  __typename: string;
  blockHeight: number;
  bridgeAddress: string;
  l1Recipient: string;
  amount: string;
  callerAddress: string;
  transfers: Transfer[];
  timestamp: string;
}

export interface Transfer {
  from_: string;
  to: string;
  value: string;
}

export interface LastIndexedBlock {
  blockHeight: number;
}
