const hre = require('hardhat');
const ACP_ADDRESS = '0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const acp = await hre.ethers.getContractAt('AgenticCommerce', ACP_ADDRESS);

  // Check current state
  const count = await acp.jobCounter();
  console.log('Current jobCounter:', count.toString());

  if (Number(count) > 0) {
    const job1 = await acp.getJob(1);
    console.log('Job #1:', {
      id: job1.id.toString(),
      client: job1.client,
      provider: job1.provider,
      evaluator: job1.evaluator,
      status: job1.status.toString(),
      desc: job1.description,
    });
  }

  // Try fund(1) if it's still Open
  if (Number(count) > 0) {
    try {
      const job = await acp.getJob(1);
      console.log('\nJob #1 status:', job.status.toString(), '(0=Open, 1=Funded)');
      if (Number(job.status) === 0) {
        console.log('Funding job #1...');
        const tx = await acp.fund(1);
        const r = await tx.wait();
        console.log('Fund tx:', r.hash);
      }
    } catch (e) {
      console.error('fund error:', e.reason || e.message);
    }
  }
}

main().catch((e) => { console.error(e.reason || e.message); process.exitCode = 1; });
