import { ListBridgeMetadata } from './interfaces';

const l2BridgeAddressToL1Goerli: ListBridgeMetadata = {
  '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    l1TokenAddress: '0x0000000000000000000000000000000000000000',
    l2TokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    l1BridgeAddress: '0xc3511006C04EF1d78af4C8E0e74Ec18A6E64Ff9e',
    gas: '68000',
  },
  '0x00214e168720c6eed858066bea070afa828512e83edcfc28846f0e87221f77f6': {
    name: 'Rocket Pool ETH',
    symbol: 'rETH',
    decimals: 18,
    l1TokenAddress: '0x178E141a0E3b34152f73Ff610437A7bf9B83267A',
    l2TokenAddress: '0x002133188109385fedaac0b1bf9de1134e271b88efcd21e2ea0dac460639fbe2',
    l1BridgeAddress: '0xD2ef821C56B20a7451dbbEd1ec003De6C44F8dC0',
    gas: '100000',
  },
};

const l2BridgeAddressToL1Mainnet: ListBridgeMetadata = {
  '0x07aeec4870975311a7396069033796b61cd66ed49d22a786cba12a8d76717302': {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    l1TokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    l2TokenAddress: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    l1BridgeAddress: '0x283751A21eafBFcD52297820D27C1f1963D9b5b4',
    gas: '110000',
  },
  '0x05cd48fccbfd8aa2773fe22c217e808319ffcc1c5a6a463f7d8fa2da48218196': {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    l1TokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    l2TokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    l1BridgeAddress: '0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816',
    gas: '110000',
  },
  '0x074761a8d48ce002963002becc6d9c3dd8a2a05b1075d55e5967f42296f16bd0': {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    l1TokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    l2TokenAddress: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    l1BridgeAddress: '0xbb3400F107804DFB482565FF1Ec8D8aE66747605',
    gas: '11000',
  },
  '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82': {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    l1TokenAddress: '0x0000000000000000000000000000000000000000',
    l2TokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    l1BridgeAddress: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
    gas: '68000',
  },
};

export const networkListBridgeMetadata = (network: string): ListBridgeMetadata => {
  switch (network) {
    case 'mainnet':
      return l2BridgeAddressToL1Mainnet;
    default:
      return l2BridgeAddressToL1Goerli;
  }
};

