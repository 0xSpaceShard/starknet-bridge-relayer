import { Withdrawal } from 'indexer/entities';
import { MulticallRequest } from 'web3/web3.interface';

export const withdrawalsResponseMock: Array<Withdrawal> = [
  {
    blockHeight: 300117,
    bridgeAddress: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
    l1Recipient: '0x000000000000000000000000d1b4dacf4af49a6265e6559bb85e564ec8f5a44b',
    amount: '100000000000000',
    callerAddress: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
    transfers: [
      {
        from_: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
        to: '0x027f237537479fd27551379d1acc58f5448386a7094aac9b269e5d57aaf9d8c7',
        value: '100000000000000',
      },
    ],
    timestamp: '2022-08-17T01:57:41',
    __typename: 'withdraw',
  },
  {
    blockHeight: 300117,
    bridgeAddress: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
    l1Recipient: '0x000000000000000000000000d1b4dacf4af49a6265e6559bb85e564ec8f5a44b',
    amount: '100000000000000',
    callerAddress: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
    transfers: [
      {
        from_: '0x07f3daf45d6e531ff3c6c96f052fe3384c970e68e18d32e0826908e1fa48dd9d',
        to: '0x027f237537479fd27551379d1acc58f5448386a7094aac9b269e5d57aaf9d8c7',
        value: '100000000000000',
      },
    ],
    timestamp: '2022-08-17T01:57:41',
    __typename: 'withdraw',
  },
  {
    blockHeight: 300121,
    bridgeAddress: '0x00214e168720c6eed858066bea070afa828512e83edcfc28846f0e87221f77f6',
    l1Recipient: '0x000000000000000000000000d60f50848e7b159eb72e2124d0115aaa6de1d5c7',
    amount: '80000000000000000',
    callerAddress: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
    transfers: [
      {
        from_: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
        to: '0x027f237537479fd27551379d1acc58f5448386a7094aac9b269e5d57aaf9d8c7',
        value: '80000000000000000',
      },
    ],
    timestamp: '2022-08-17T02:03:56',
    __typename: 'withdraw',
  },
  {
    blockHeight: 300121,
    bridgeAddress: '0x00214e168720c6eed858066bea070afa828512e83edcfc28846f0e87221f77f6',
    l1Recipient: '0x000000000000000000000000d60f50848e7b159eb72e2124d0115aaa6de1d5c7',
    amount: '80000000000000000',
    callerAddress: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
    transfers: [
      {
        from_: '0x007bf1415672a805e247045d4d8c8d96c5b27973811bf523b822577ad8dd8665',
        to: '0x027f237537479fd27551379d1acc58f5448386a7094aac9b269e5d57aaf9d8c7',
        value: '80000000000000000',
      },
    ],
    timestamp: '2022-08-17T02:03:56',
    __typename: 'withdraw',
  },
  {
    blockHeight: 300122,
    bridgeAddress: '0x00214e168720c6eed858066bea070afa828512e83edcfc28846f0e87221f77f6',
    l1Recipient: '0x0000000000000000000000007a04d037767945270a1b14a3ac632404ca5c28f7',
    amount: '50000000000000000',
    callerAddress: '0x01e1b971b4169a8fd820fb468b6c3b4516cd702592b300b8cb74121c922adfb9',
    transfers: [
      {
        from_: '0x01e1b971b4169a8fd820fb468b6c3b4516cd702592b300b8cb74121c922adfb9',
        to: '0x027f237537479fd27551379d1acc58f5448386a7094aac9b269e5d57aaf9d8c7',
        value: '50000000000000000',
      },
    ],
    timestamp: '2022-08-17T02:06:02',
    __typename: 'withdraw',
  },
];

export const canConsumeMessageOnL1MulticallViewResponseExpectedOutput = {
  valid: 2,
  notValid: 3,
};

export const canConsumeMessageOnL1MulticallViewResponse = [
  {
    success: true,
    returnData: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    success: true,
    returnData: '0x0000000000000000000000000000000000000000000000000000000000000001',
  },
  {
    success: true,
    returnData: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    success: true,
    returnData: '0x0000000000000000000000000000000000000000000000000000000000000001',
  },
  {
    success: true,
    returnData: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
];

export const multicallRequestConsumeMessagesOnL1Mock: Array<MulticallRequest> = [
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1156e4be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1146e4be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1136e4be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1126e4be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1116e4be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e9be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e8be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e7be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e6be',
    gas: '0',
  },
  {
    target: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    callData: '0xa46efaf30e19665ae684518682f0f3b8b495c78869a082d4b55235f158e0e66b1106e5be',
    gas: '0',
  },
];
