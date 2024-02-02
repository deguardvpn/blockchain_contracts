const { ethers } = require("hardhat");

async function main() {
  const DeGuardBuyGift = await ethers.getContractFactory("DeGuardBuyGift");

  const contract = await DeGuardBuyGift.deploy(
    "0x787CF93043fa92Aae5Cf7f1cE396c95e497F14DC"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBuyGift Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
