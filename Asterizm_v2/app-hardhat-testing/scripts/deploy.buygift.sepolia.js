const { ethers } = require("hardhat");

async function main() {
  const DeGuardBuyGift = await ethers.getContractFactory("DeGuardBuyGift");

  const contract = await DeGuardBuyGift.deploy(
    "0x653e7465b013DfaE0AEFCac527bDfe0EC4A3F390"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBuyGift Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
