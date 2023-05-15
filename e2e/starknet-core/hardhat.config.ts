import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.6.12',
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL || '',
      },
    },
    localhost: {
      url: 'http://0.0.0.0:8545',
    },
  },
};

export default config;
