import { BSON } from 'bson';
import * as fs from 'fs';
import { WithdrawalDoc } from './interfaces';
import { ethers } from 'ethers';
import { uint256 } from 'starknet';

export const getMessageHash = (
  l2BridgeAddress: string,
  l1BridgeAddress: string,
  receiverL1: string,
  amount: string,
): string => {
  const amountUint256 = uint256.bnToUint256(amount.toString());
  const payload = [0, receiverL1, amountUint256.low, amountUint256.high];
  return ethers.utils.solidityKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint256[]'],
    [l2BridgeAddress, l1BridgeAddress, payload.length, payload],
  );
};

export const decodeBSONFile = (file: string, docLength: number, docIndex: number) => {
  let withdrawals: WithdrawalDoc[] = [];
  BSON.deserializeStream(fs.readFileSync(file), 0, docLength, withdrawals, docIndex, {
    promoteBuffers: true,
  });
  return withdrawals;
};
