import { LastIndexedBlock, Withdrawal } from 'indexer/entities';

export interface GetWithdrawalsResponse {
  withdraw: Array<Withdrawal>;
}

export interface GetLastIndexedBlockResponse {
  withdraws: Array<LastIndexedBlock>;
}
