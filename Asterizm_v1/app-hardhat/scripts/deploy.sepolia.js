const hre = require('hardhat');

async function main() {
  const DeGuardNFT = await ethers.getContractFactory('MultichainToken');

  const token = await DeGuardNFT.deploy(
    '0x6Aab8e55a4D010F9614b22Fb47bA407eA5814bAc'
  );

  await token.waitForDeployment();

  console.log(`DeGuard NFT deployed to ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
