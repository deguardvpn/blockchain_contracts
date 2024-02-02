const { ethers } = require("hardhat");

async function main() {
  const MintAndTransfer = await ethers.getContractFactory("DeGuardBatcher");

  const contract = await MintAndTransfer.deploy(
    "0x653e7465b013DfaE0AEFCac527bDfe0EC4A3F390"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBatcher Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
