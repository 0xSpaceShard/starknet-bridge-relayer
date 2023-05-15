export interface NetworkConfig {
  sleepAfterSuccessExec: number;
  sleepAfterFailExec: number;
  chunk: number;
}

export const getNetworkConfig = (network: string): NetworkConfig => {
  switch (network) {
    case 'mainnet':
      return {
        sleepAfterSuccessExec: 86400000,
        sleepAfterFailExec: 600000,
        chunk: 50,
      };
    default:
      // testnet
      return {
        sleepAfterSuccessExec: 14400000,
        sleepAfterFailExec: 600000,
        chunk: 50,
      };
  }
};
