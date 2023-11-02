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
    ["0xF10866C198AA05f56697a5b35d165878c22eC08D"],
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
