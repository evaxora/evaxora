const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Balance:', hre.ethers.formatEther(balance), 'ETH');

  const Factory = await hre.ethers.getContractFactory('EvaxoraRegistry');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('EvaxoraRegistry deployed to:', address);

  // Write the address to a file for the frontend
  const fs = require('fs');
  fs.writeFileSync('contract-address.txt', address);
  console.log('Contract address saved to contract-address.txt');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
