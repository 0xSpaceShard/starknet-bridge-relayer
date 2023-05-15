import { withdrawalsResponseMock } from './data';

export const totalWithdrawalMock = (count: number) => {
  const withdrawals = [];
  for (let i = 0; i < count; i++) {
    withdrawals.push(withdrawalsResponseMock[0]);
  }
  return withdrawals;
};
