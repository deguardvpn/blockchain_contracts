require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');
require('@nomicfoundation/hardhat-verify');

require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    bscTestnet: {
      url: process.env.NETWORK_HOST_BSC_TESTNET,
      accounts: [process.env.OWNER_PK_ASTERIZM_TEST],
      chainId: 97,
    },
    ethSepolia: {
      url: process.env.NETWORK_HOST_ETHEREUM_SEPOLIA,
      accounts: [process.env.OWNER_PK_ASTERIZM_TEST],
      chainId: 11155111,
    },
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};
