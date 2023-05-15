import { Binary, Timestamp } from 'bson';
import { ObjectId } from 'mongoose';

export interface WithdrawalDoc {
  _id: ObjectId;
  block_height: number;
  bridge_address: Binary;
  l1_recipient: Binary;
  amount: Binary;
  caller_address: Binary;
  transfers: TransferDoc[];
  timestamp: Timestamp;
  _chain: { valid_from: number; valid_to: number | null };
}

export interface TransferDoc {
  from_: Binary;
  to: Binary;
  amount: Binary;
}
