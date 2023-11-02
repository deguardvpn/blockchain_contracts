require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
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
    polygonMumbai: {
      url: process.env.NETWORK_HOST_POLYGON_MUMBAI,
      accounts: [process.env.OWNER_PK_ASTERIZM_TEST],
      chainId: 80001,
    },
    "base-goerli": {
      url: process.env.NETWORK_HOST_BASE_GOERLI,
      accounts: [process.env.OWNER_PK_ASTERIZM_TEST],
      chainId: 84531,
    },
    linea_testnet: {
      url: process.env.NETWORK_HOST_LINEA_TESTNET,
      accounts: [process.env.OWNER_PK_ASTERIZM_TEST],
      chainId: 59140,
    },
    bsc: {
      url: process.env.NETWORK_HOST_BSC,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 56,
    },
    polygon: {
      url: process.env.NETWORK_HOST_POLYGON,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 137,
    },
    arbitrum: {
      url: process.env.NETWORK_HOST_ARBITRUM,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 42161,
    },
    fantom: {
      url: process.env.NETWORK_HOST_FANTOM,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 250,
    },
    linea_mainnet: {
      url: process.env.NETWORK_HOST_LINEA,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 59144,
    },
    "base-mainnet": {
      url: process.env.NETWORK_HOST_BASE,
      accounts: [process.env.OWNER_PK_ASTERIZM],
      chainId: 8453,
    },
  },
  solidity: {
    version: "0.8.19",
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
      bscTestnet: process.env.BSCSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      arbitrumOne: process.env.ARBITRUM_API_KEY,
      opera: process.env.FANTOM_API_KEY,
      linea_mainnet: process.env.LINEA_API_KEY,
      base: process.env.BASE_API_KEY,
    },
    customChains: [
      {
        network: "linea_mainnet",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
