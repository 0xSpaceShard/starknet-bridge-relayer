export const EtherscanApiUrl = (network: string): string=>  {
    switch (network) {
        case 'mainnet':
            return 'https://api.etherscan.io/api'
        default:
            return 'https://api-goerli.etherscan.io/api'
    }
};
export const OneGwei = 1000000000;
export const FiveGwei = 5000000000;
// export const GasCostPerWithdrawal = 65000;
// export const GasCostMultiplePerWithdrawal = 50000;
export const BlockNumber24H = 5760; // 84600 / 14

export const CacheFeeHistoryKey = 'feeHistory'
export const CacheDuration24hInMs = 86400000 // 1000 * 60 * 60 * 24
export const CheckPointSizeMs = 900
export const FeeShiftPercentage = 20 // additional fee to charge the users 20%
