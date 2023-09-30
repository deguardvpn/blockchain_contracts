const hre = require('hardhat');

async function main() {
  const DeGuardNFT = await ethers.getContractFactory('MultichainToken');

  const token = await DeGuardNFT.deploy(
    '0xcD57Bfd5B75e0C82c0a4F85fE95a5cE13459dd8B'
  );

  await token.waitForDeployment();

  console.log(`DeGuard NFT deployed to ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
