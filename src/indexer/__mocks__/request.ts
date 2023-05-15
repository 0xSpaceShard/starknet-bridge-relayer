export const requestWithdrawalsMock = {
  request: jest.fn(() => {
    return getWithdrawalsMockResponse;
  }),
};

export const getWithdrawalsMockResponse = {
  withdraw: [
    {
      blockHeight: 300117,
      bridgeAddress: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
      l1Recipient: '0x000000000000000000000000d1b4dacf4af49a6265e6559bb85e564ec8f5a44b',
      amount: '100000000000000',
      transfers: [],
      callerAddress: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
      timestamp: '2022-08-17T01:57:41',
    },
    {
      blockHeight: 300117,
      bridgeAddress: '0x0278f24c3e74cbf7a375ec099df306289beb0605a346277d200b791a7f811a19',
      l1Recipient: '0x000000000000000000000000d1b4dacf4af49a6265e6559bb85e564ec8f5a44b',
      amount: '100000000000000',
      transfers: [],
      callerAddress: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
      timestamp: '2022-08-17T01:57:41',
    },
    {
      blockHeight: 300121,
      bridgeAddress: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
      l1Recipient: '0x000000000000000000000000d60f50848e7b159eb72e2124d0115aaa6de1d5c7',
      amount: '80000000000000000',
      transfers: [],
      callerAddress: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
      timestamp: '2022-08-17T02:03:56',
    },
    {
      blockHeight: 300121,
      bridgeAddress: '0x0278f24c3e74cbf7a375ec099df306289beb0605a346277d200b791a7f811a19',
      l1Recipient: '0x000000000000000000000000d60f50848e7b159eb72e2124d0115aaa6de1d5c7',
      amount: '80000000000000000',
      transfers: [],
      callerAddress: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
      timestamp: '2022-08-17T02:03:56',
    },
    {
      blockHeight: 300122,
      bridgeAddress: '0x0278f24c3e74cbf7a375ec099df306289beb0605a346277d200b791a7f811a19',
      l1Recipient: '0x0000000000000000000000007a04d037767945270a1b14a3ac632404ca5c28f7',
      amount: '50000000000000000',
      transfers: [],
      callerAddress: '0x01e1b971b4169a8fd820fb468b6c3b4516cd702592b300b8cb74121c922adfb9',
      timestamp: '2022-08-17T02:06:02',
    },
  ],
};
