const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.waitForDeployment();

  const address = await marketplace.getAddress();
  const abi = marketplace.interface.formatJson
    ? JSON.parse(marketplace.interface.formatJson())
    : JSON.parse(marketplace.interface.format("json"));

  const frontendDir = path.join(__dirname, "..", "frontend", "src");
  const outputPath = path.join(frontendDir, "Marketplace.json");

  fs.writeFileSync(
    outputPath,
    JSON.stringify({ address, abi }, null, 2)
  );

  console.log("Sepolia deployment complete");
  console.log("Contract address:", address);
  console.log("Updated file:", outputPath);
  console.log("Set this in Vercel:");
  console.log(`REACT_APP_MARKETPLACE_ADDRESS=${address}`);
  console.log("Also set:");
  console.log("REACT_APP_CHAIN_ID=11155111");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
