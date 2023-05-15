import { BigNumber } from 'ethers';
import { CheckPointSizeMs, FiveGwei, OneGwei } from './gas.constants';

export const roundBigNumber = (input: BigNumber): BigNumber => {
  return input.div(OneGwei).mul(OneGwei);
};

export const ceilBigNumber = (input: BigNumber): BigNumber => {
  const mod = input.mod(FiveGwei);
  return input.sub(mod).add(mod.gt(0) ? FiveGwei : 0);
};

export const clampTimestamp = (timestamp: number): number => {
  return timestamp - (timestamp % CheckPointSizeMs) - CheckPointSizeMs;
};
