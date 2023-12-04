// const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

async function main() {
  // const gas = await ethers.provider.getGasPrice();
  const feeData = await ethers.provider.getFeeData();
  const DeGuardNFT = await ethers.getContractFactory("DeGuardNFT");

  // const token = await DeGuardNFT.deploy(
  //   "0xE412121479211c3e9c50EC940F50596f293c08F0"
  // );

  const proxy = await upgrades.deployProxy(
    DeGuardNFT,
    ["0xe27C3853936810E967824A2ECD43302D28DfE97C"],
    {
      gasPrice: feeData.gasPrice,
      // initializer: '_initializerLib',
    }
  );

  await proxy.waitForDeployment();

  console.log(`DeGuard NFT deployed to ${proxy.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
