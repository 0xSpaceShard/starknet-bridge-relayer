import { TRANSFER_FROM_STARKNET } from './relayer.constants';
import { uint256 } from 'starknet';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const callWithRetry = async (retries: number, delay: number, callback: Function, errorCallback: Function) => {
  for (let i = 1; i <= retries; i++) {
    try {
      return await callback(i);
    } catch (error: any) {
      sleep(delay);
      if (i == retries) {
        errorCallback(error);
      }
    }
  }
};

export const getMessageHash = (
  l2BridgeAddress: string,
  l1BridgeAddress: string,
  receiverL1: string,
  amount: string,
): string => {
  const amountUint256 = uint256.bnToUint256(amount.toString());
  const payload = [TRANSFER_FROM_STARKNET, receiverL1, amountUint256.low, amountUint256.high];
  return ethers.utils.solidityKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint256[]'],
    [l2BridgeAddress, l1BridgeAddress, payload.length, payload],
  );
};

export const formatDecimals = (value: BigNumber): string => {
  if (!value.toString()) return "0"
  return ethers.utils.formatUnits(value, 18).toString();
};
