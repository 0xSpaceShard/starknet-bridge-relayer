import { BigNumber } from "ethers";

export const ZeroBytes = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const TRANSFER_FROM_STARKNET = 0;
export const NumberOfWithdrawalsToProcessPerTransaction = 50
export const NumberOfMessageToProcessPerTransaction = 50
export const MinimumEthBalance = BigNumber.from(1e17.toString()) // 0.1 ETH
