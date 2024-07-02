// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CharityDonationTracker = await hre.ethers.getContractFactory("CharityDonationTracker");

  // Deploy the contract
  const charityDonationTracker = await CharityDonationTracker.deploy();
  await charityDonationTracker.deployed();

  console.log(`CharityDonationTracker deployed to ${charityDonationTracker.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
