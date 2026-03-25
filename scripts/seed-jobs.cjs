const hre = require('hardhat');
const ACP_ADDRESS = '0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const acp = await hre.ethers.getContractAt('AgenticCommerce', ACP_ADDRESS);
  const z = '0x0000000000000000000000000000000000000000';
  const futureExpiry = Math.floor(Date.now() / 1000) + 86400 * 30;

  const count = Number(await acp.jobCounter());
  console.log('Current jobCounter:', count);

  // Print existing jobs
  for (let i = 1; i <= count; i++) {
    const j = await acp.getJob(i);
    const statuses = ['Open','Funded','Submitted','Completed','Rejected','Expired'];
    console.log(`Job #${i}: ${statuses[Number(j.status)]} — "${j.description}"`);
  }

  // Create one more job (Funded)
  if (count < 3) {
    const nextId = count + 1;
    console.log(`\nCreating Job #${nextId} (Translation eval)...`);
    let tx = await acp.createJob(deployer.address, deployer.address, futureExpiry, 'Translation eval: EN-JP docs', z, 0);
    await tx.wait();
    console.log('Created. Funding...');
    tx = await acp.fund(nextId);
    await tx.wait();
    console.log(`Job #${nextId} is now Funded`);
  }

  console.log('\nDone. Final count:', (await acp.jobCounter()).toString());
}

main().catch((e) => { console.error('Error:', e.reason || e.message); process.exitCode = 1; });
