const { ethers } = require("hardhat");

async function main() {
  const MintAndTransfer = await ethers.getContractFactory("DeGuardBatcher");

  const contract = await MintAndTransfer.deploy(
    "0x35A5206D4f58ae3114a356a18c0277dc032a17d5"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBatcher Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
