const { ethers } = require("hardhat");

async function main() {
  const MintAndTransfer = await ethers.getContractFactory("MintAndTransfer");

  const contract = await MintAndTransfer.deploy(
    "0x653e7465b013DfaE0AEFCac527bDfe0EC4A3F390"
  );

  await contract.waitForDeployment();

  console.log("MintAndTransfer Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
