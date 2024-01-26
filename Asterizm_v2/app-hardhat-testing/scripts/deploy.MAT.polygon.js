const { ethers } = require("hardhat");

async function main() {
  const MintAndTransfer = await ethers.getContractFactory("MintAndTransfer");

  const contract = await MintAndTransfer.deploy(
    "0xdb25309AAF93744a0883B44D1D3dfeBeD83B338B"
  );

  await contract.waitForDeployment();

  console.log("MintAndTransfer Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
