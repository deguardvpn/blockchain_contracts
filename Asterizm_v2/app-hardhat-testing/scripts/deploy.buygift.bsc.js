const { ethers } = require("hardhat");

async function main() {
  const DeGuardBuyGift = await ethers.getContractFactory("DeGuardBuyGift");

  const contract = await DeGuardBuyGift.deploy(
    "0x35A5206D4f58ae3114a356a18c0277dc032a17d5"
  );

  await contract.waitForDeployment();

  console.log("DeGuardBuyGift Contract Deployed To:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
