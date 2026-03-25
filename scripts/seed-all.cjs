const hre = require('hardhat');

const REGISTRY = '0x737647acA2658B426eBEb7113C26f33af3bad620';
const ACP = '0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Seeding with:', deployer.address);

  // --- Register Evaluators ---
  const registry = await hre.ethers.getContractAt('EvaxoraRegistry', REGISTRY);
  const isReg = await registry.isRegistered(deployer.address);
  
  if (!isReg) {
    console.log('\n=== Registering Evaluators ===');
    // Register deployer as first evaluator
    let tx = await registry.registerEvaluator('Sentinel-7B', 0, 'Security', 'AI-powered security auditor for Solidity smart contracts. Detects reentrancy, overflow, and access control vulnerabilities.');
    await tx.wait(); console.log('✓ Sentinel-7B registered');
  } else {
    console.log('Deployer already registered, skipping self-registration');
  }

  // We need more wallets for different evaluators — create them from the deployer
  // For demo purposes, we'll use different addresses from the same seed
  const wallets = [
    { name: 'zkVerify-Core', type: 1, domain: 'ZK Proofs', desc: 'Zero-knowledge proof verification engine. Validates Groth16, PLONK, and STARK proofs with formal correctness guarantees.' },
    { name: 'AuditVault', type: 2, domain: 'Finance', desc: 'Multi-signature evaluation committee for DeFi protocol assessments. 3-of-5 threshold for fund management audits.' },
    { name: 'ProofEngine', type: 3, domain: 'Governance', desc: 'DAO-governed evaluation framework. Community-driven assessment of protocol proposals and treasury allocations.' },
    { name: 'NeuralEval', type: 0, domain: 'AI/ML', desc: 'Neural network evaluation agent specialized in assessing AI model quality, training data integrity, and inference accuracy.' },
  ];

  // Generate wallets for each evaluator
  for (let i = 0; i < wallets.length; i++) {
    const w = wallets[i];
    const wallet = hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
    
    // Fund the wallet with a small amount for gas
    const fundTx = await deployer.sendTransaction({
      to: wallet.address,
      value: hre.ethers.parseEther('0.001'),
    });
    await fundTx.wait();
    console.log(`Funded ${w.name} (${wallet.address.slice(0,10)}...)`);

    // Register evaluator from this wallet
    const regWithWallet = registry.connect(wallet);
    const tx = await regWithWallet.registerEvaluator(w.name, w.type, w.domain, w.desc);
    await tx.wait();
    console.log(`✓ ${w.name} registered`);
  }

  // Verify deployer evaluator
  console.log('\nVerifying Sentinel-7B...');
  const verifyTx = await registry.setVerified(deployer.address, true);
  await verifyTx.wait();
  console.log('✓ Sentinel-7B verified');

  // --- Create more jobs ---
  console.log('\n=== Creating More Jobs ===');
  const acp = await hre.ethers.getContractAt('AgenticCommerce', ACP);
  const count = Number(await acp.jobCounter());
  console.log('Current jobs:', count);

  const z = '0x0000000000000000000000000000000000000000';
  const futureExpiry = Math.floor(Date.now() / 1000) + 86400 * 30;

  const newJobs = [
    'Smart contract formal verification — Uniswap V4 hooks',
    'AI model bias evaluation — GPT-5 hiring assistant',
    'DeFi yield strategy risk assessment — Aave V3 migration',
    'NFT metadata integrity audit — on-chain SVG generation',
    'Cross-chain bridge security review — LayerZero V2',
  ];

  for (let i = 0; i < newJobs.length; i++) {
    const tx = await acp.createJob(deployer.address, deployer.address, futureExpiry, newJobs[i], z, 0);
    await tx.wait();
    console.log(`✓ Job #${count + i + 1}: ${newJobs[i].slice(0, 40)}...`);
  }

  // Fund and advance some of the new jobs
  const newCount = Number(await acp.jobCounter());
  
  // Fund job (count+1)
  if (count + 1 <= newCount) {
    let tx = await acp.fund(count + 1);
    await tx.wait();
    console.log(`✓ Job #${count+1} funded`);
  }

  // Fund + submit job (count+2)
  if (count + 2 <= newCount) {
    let tx = await acp.fund(count + 2);
    await tx.wait();
    tx = await acp.submit(count + 2, hre.ethers.encodeBytes32String('bias-report'));
    await tx.wait();
    console.log(`✓ Job #${count+2} submitted`);
  }

  // Fund + submit + complete job (count+3)
  if (count + 3 <= newCount) {
    let tx = await acp.fund(count + 3);
    await tx.wait();
    tx = await acp.submit(count + 3, hre.ethers.encodeBytes32String('risk-report'));
    await tx.wait();
    tx = await acp.complete(count + 3, hre.ethers.encodeBytes32String('pass'));
    await tx.wait();
    console.log(`✓ Job #${count+3} completed`);
  }

  // Print final state
  const finalJobs = Number(await acp.jobCounter());
  const evalCount = Number(await registry.evaluatorCount());
  console.log(`\n=== DONE ===`);
  console.log(`Evaluators: ${evalCount}`);
  console.log(`Jobs: ${finalJobs}`);
}

main().catch((e) => { console.error('Error:', e.reason || e.message); process.exitCode = 1; });
