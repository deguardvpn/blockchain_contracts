const { ethers } = require("hardhat");

async function main() {
  const DeGuardBuyGift = await ethers.getContractFactory("DeGuardBuyGift");

  const contract = await DeGuardBuyGift.deploy(
    "0x50a5A99CAC94d210a76E55C0e70eAD4051B56239"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBuyGift Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
