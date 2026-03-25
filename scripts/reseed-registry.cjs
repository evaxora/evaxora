const hre = require('hardhat');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Balance:', hre.ethers.formatEther(bal), 'ETH');

  // 1. Deploy fresh EvaxoraRegistry
  console.log('\n--- Deploying EvaxoraRegistry ---');
  const Registry = await hre.ethers.getContractFactory('EvaxoraRegistry');
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const regAddr = await registry.getAddress();
  console.log('✓ New EvaxoraRegistry:', regAddr);
  await sleep(4000);

  // 2. Register Vireon (deployer wallet)
  console.log('\n[1/5] Registering Vireon...');
  let tx = await registry.registerEvaluator(
    'Vireon', 0, 'Security',
    'Independent smart contract auditor specializing in DeFi protocol assessments and vulnerability detection.'
  );
  await tx.wait();
  console.log('✓ Vireon registered');
  await sleep(4000);

  // Verify Vireon
  tx = await registry.setVerified(deployer.address, true);
  await tx.wait();
  console.log('✓ Vireon verified');
  await sleep(4000);

  // 3. Register remaining evaluators
  const agents = [
    { name: 'Kryzeth', type: 1, domain: 'ZK Proofs', desc: 'Zero-knowledge proof verification specialist. Validates zk-SNARK and PLONK circuits for privacy-preserving protocols.' },
    { name: 'Oryntal', type: 2, domain: 'DeFi', desc: 'Multi-signature evaluation committee for decentralized finance. Reviews lending protocols, yield vaults, and bridge security.' },
    { name: 'Zenvor', type: 3, domain: 'Governance', desc: 'DAO-governed evaluation framework focused on protocol governance proposals, treasury management, and community decisions.' },
    { name: 'Thalric', type: 0, domain: 'AI/ML', desc: 'Evaluation agent for AI model quality, training data integrity, and inference accuracy benchmarks.' },
  ];

  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    console.log(`\n[${i+2}/5] Registering ${a.name}...`);
    
    const wallet = hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);
    
    // Fund wallet
    const fundTx = await deployer.sendTransaction({
      to: wallet.address,
      value: hre.ethers.parseEther('0.001'),
    });
    await fundTx.wait();
    console.log(`  Funded ${wallet.address.slice(0,10)}...`);
    await sleep(4000);

    // Register
    const regWithWallet = registry.connect(wallet);
    const regTx = await regWithWallet.registerEvaluator(a.name, a.type, a.domain, a.desc);
    await regTx.wait();
    console.log(`  ✓ ${a.name} registered`);
    await sleep(4000);
  }

  const count = Number(await registry.evaluatorCount());
  console.log(`\n=============================`);
  console.log(`  NEW REGISTRY: ${regAddr}`);
  console.log(`  EVALUATORS: ${count}`);
  console.log(`=============================`);
}

main().catch((e) => { console.error('FATAL:', e.reason || e.message); process.exitCode = 1; });
