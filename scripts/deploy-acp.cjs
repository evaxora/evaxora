const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const ACP = await hre.ethers.getContractFactory('AgenticCommerce');
  console.log('Deploying...');
  const acp = await ACP.deploy();
  await acp.waitForDeployment();
  const addr = await acp.getAddress();
  console.log('AgenticCommerce:', addr);

  const fs = require('fs');
  fs.writeFileSync('deployed-contracts.txt', `AGENTIC_COMMERCE=${addr}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
