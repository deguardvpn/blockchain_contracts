// const hre = require("hardhat");
const { ethers, upgrades } = require('hardhat');

async function main() {
  const feeData = await ethers.provider.getFeeData();
  const DeGuardNFT = await ethers.getContractFactory("DeGuardNFT");

  // Not upgradable deploy
  // const token = await DeGuardNFT.deploy(
  //   "0xE412121479211c3e9c50EC940F50596f293c08F0"
  // );

  const proxy = await upgrades.deployProxy(
    DeGuardNFT,
    ['0xE412121479211c3e9c50EC940F50596f293c08F0'],
    {
      gasPrice: feeData.gasPrice,


      
    }
  );

  await proxy.waitForDeployment();

  console.log(`DeGuard NFT deployed to ${proxy.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
