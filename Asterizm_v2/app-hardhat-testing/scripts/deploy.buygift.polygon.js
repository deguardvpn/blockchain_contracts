const { ethers } = require("hardhat");

async function main() {
  const DeGuardBuyGift = await ethers.getContractFactory("DeGuardBuyGift");

  const contract = await DeGuardBuyGift.deploy(
    "0xdb25309AAF93744a0883B44D1D3dfeBeD83B338B"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBuyGift Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
