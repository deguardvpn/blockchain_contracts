const { ethers, upgrades } = require('hardhat');

const UPGRADEABLE_PROXY = '0x253f18783e0E77D597223D59331aE648Ca2586EE';

async function main() {
  const feeData = await ethers.provider.getFeeData();
  const DeGuardNFT_V2 = await ethers.getContractFactory('DeGuardNFT');
  console.log('Upgrading DeGuardNFT...');
  let upgrade = await upgrades.upgradeProxy(UPGRADEABLE_PROXY, DeGuardNFT_V2, {
    gasPrice: feeData.gasPrice,
  });
  console.log('Upgraded to DeGuardNFT');
  console.log('DeGuardNFT Contract Deployed To:', upgrade.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
