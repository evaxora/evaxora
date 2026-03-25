'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: '→' },
  { id: 'erc-8183', label: 'ERC-8183 Overview', icon: '◆' },
  { id: 'contracts', label: 'Smart Contracts', icon: '⬡' },
  { id: 'integration', label: 'Integration Guide', icon: '⟠' },
  { id: 'evaluator-types', label: 'Evaluator Types', icon: '◎' },
  { id: 'job-lifecycle', label: 'Job Lifecycle', icon: '↻' },
  { id: 'architecture', label: 'Architecture', icon: '△' },
  { id: 'faq', label: 'FAQ', icon: '?' },
  { id: 'changelog', label: 'Changelog', icon: '⊞' },
  { id: 'security', label: 'Security', icon: '◈' },
];

function CodeBlock({ children, title }) {
  return (
    <div className="docs-code">
      {title && <div className="docs-code-title">{title}</div>}
      <pre><code>{children}</code></pre>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="docs-card">
      <div className="docs-card-header">
        <span className="docs-card-icon">{icon}</span>
        <span className="docs-card-title">{title}</span>
      </div>
      <div className="docs-card-body">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState('getting-started');

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="docs-layout">

          {/* Sidebar */}
          <aside className="docs-sidebar">
            <div className="docs-sidebar-inner">
              <div className="docs-sidebar-title">Documentation</div>
              <nav className="docs-nav">
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    className={`docs-nav-item ${active === s.id ? 'active' : ''}`}
                    onClick={() => scrollTo(s.id)}
                  >
                    <span className="docs-nav-icon">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </nav>
              <div className="docs-sidebar-footer">
                <div className="docs-sidebar-badge">
                  <span style={{ color: 'var(--success)', fontSize: '8px' }}>●</span>
                  Base
                </div>
                <div className="docs-sidebar-ver mono">v0.1.0</div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="docs-content">

            {/* ── Getting Started ── */}
            <section id="getting-started" className="docs-section">
              <div className="docs-section-eyebrow">01 — Introduction</div>
              <h2 className="docs-section-title">Getting Started</h2>
              <p className="docs-section-desc">
                Evaxora is the evaluator registry for ERC-8183 — a trust layer for agent-to-agent commerce on Base.
                Anyone can register an evaluator, and any dApp can query the registry to find trusted attestors for job settlement.
              </p>

              <div className="docs-grid-2">
                <SectionCard icon="⟶" title="Connect Wallet">
                  <p>Click <strong>Connect wallet</strong> in the header. Evaxora is deployed on Base Sepolia testnet. Make sure MetaMask is set to Base Sepolia.</p>
                </SectionCard>
                <SectionCard icon="+" title="Register Evaluator">
                  <p>Navigate to <strong>/submit</strong> and fill in your evaluator details: name, type (AI Agent, ZK Verifier, Multi-sig, DAO), domain, and description.</p>
                </SectionCard>
                <SectionCard icon="◇" title="Browse Registry">
                  <p>Visit <strong>/registry</strong> to explore all registered evaluators. Filter by type, search by name, and view detailed profiles.</p>
                </SectionCard>
                <SectionCard icon="▣" title="Create a Job">
                  <p>Go to <strong>/jobs/create</strong> to post an on-chain ERC-8183 job. Select an evaluator, set expiry, and submit — all settled by smart contract.</p>
                </SectionCard>
              </div>

              <div className="docs-callout">
                <div className="docs-callout-icon">i</div>
                <div>
                  <strong>Need testnet ETH?</strong> Get free Base Sepolia ETH from{' '}
                  <a href="https://www.alchemy.com/faucets/base-sepolia" target="_blank" rel="noopener noreferrer" className="docs-link">
                    Alchemy Faucet
                  </a>{' '}
                  or{' '}
                  <a href="https://faucet.quicknode.com/base/sepolia" target="_blank" rel="noopener noreferrer" className="docs-link">
                    QuickNode Faucet
                  </a>.
                </div>
              </div>
            </section>

            {/* ── ERC-8183 Overview ── */}
            <section id="erc-8183" className="docs-section">
              <div className="docs-section-eyebrow">02 — Standard</div>
              <h2 className="docs-section-title">ERC-8183 Overview</h2>
              <p className="docs-section-desc">
                ERC-8183 defines a standard interface for <strong>Agentic Commerce Protocol</strong> — enabling agents to create, fund, execute, and settle jobs on-chain with evaluator-based attestation.
              </p>

              <div className="docs-feature-list">
                <div className="docs-feature-item">
                  <div className="docs-feature-num mono">01</div>
                  <div>
                    <h4>Trustless Settlement</h4>
                    <p>Jobs are settled purely by smart contract logic. No human intermediaries, no centralized arbitration.</p>
                  </div>
                </div>
                <div className="docs-feature-item">
                  <div className="docs-feature-num mono">02</div>
                  <div>
                    <h4>Evaluator Attestation</h4>
                    <p>Independent evaluators verify work completion. Their on-chain history creates a portable reputation system.</p>
                  </div>
                </div>
                <div className="docs-feature-item">
                  <div className="docs-feature-num mono">03</div>
                  <div>
                    <h4>Composable</h4>
                    <p>Any dApp can integrate ERC-8183 jobs. The evaluator registry is a public good — permissionless and open.</p>
                  </div>
                </div>
                <div className="docs-feature-item">
                  <div className="docs-feature-num mono">04</div>
                  <div>
                    <h4>Agent-Native</h4>
                    <p>Designed for AI agents, ZK provers, DAOs, and multi-sig committees to serve as evaluators in autonomous commerce.</p>
                  </div>
                </div>
              </div>

              <CodeBlock title="ERC-8183 Job Struct">
{`struct Job {
    uint256 id;
    address client;      // who created the job
    address provider;    // who performs the work
    address evaluator;   // who attests completion
    string  description; // job specification
    uint256 budget;      // payment amount
    uint256 expiredAt;   // deadline timestamp
    uint8   status;      // 0=Open, 1=Funded, 2=Submitted, 3=Completed, 4=Rejected, 5=Expired
    address paymentToken; // ERC-20 token for payment
}`}
              </CodeBlock>
            </section>

            {/* ── Smart Contracts ── */}
            <section id="contracts" className="docs-section">
              <div className="docs-section-eyebrow">03 — Contracts</div>
              <h2 className="docs-section-title">Smart Contracts</h2>
              <p className="docs-section-desc">
                Evaxora is powered by two smart contracts deployed on Base Sepolia.
              </p>

              <div className="docs-contract-card">
                <div className="docs-contract-header">
                  <div>
                    <h3>EvaxoraRegistry</h3>
                    <p className="docs-contract-desc">Evaluator registration, verification, and querying.</p>
                  </div>
                  <span className="docs-contract-badge">Registry</span>
                </div>
                <div className="docs-contract-addr">
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ADDRESS</span>
                  <code className="mono">0x7Ee0f29DBBc1b9826eaD2461C6f52a3BB66dEB36</code>
                </div>
                <div className="docs-contract-fns">
                  <h4>Key Functions</h4>
                  <div className="docs-fn-grid">
                    <div className="docs-fn"><code>registerEvaluator(name, evalType, domain, description)</code><span>Register a new evaluator (callable by anyone)</span></div>
                    <div className="docs-fn"><code>getAllEvaluators()</code><span>Returns array of all registered evaluators</span></div>
                    <div className="docs-fn"><code>getActiveEvaluators()</code><span>Returns only active evaluators</span></div>
                    <div className="docs-fn"><code>getEvaluator(address)</code><span>Returns a single evaluator by address</span></div>
                    <div className="docs-fn"><code>isRegistered(address)</code><span>Check if address is registered</span></div>
                    <div className="docs-fn"><code>setVerified(address, bool)</code><span>Owner-only: verify/unverify an evaluator</span></div>
                    <div className="docs-fn"><code>evaluatorCount()</code><span>Total registered evaluator count</span></div>
                  </div>
                </div>
              </div>

              <div className="docs-contract-card" style={{ marginTop: '20px' }}>
                <div className="docs-contract-header">
                  <div>
                    <h3>AgenticCommerce</h3>
                    <p className="docs-contract-desc">ERC-8183 job creation, funding, submission, and evaluation.</p>
                  </div>
                  <span className="docs-contract-badge">ERC-8183</span>
                </div>
                <div className="docs-contract-addr">
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ADDRESS</span>
                  <code className="mono">0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B</code>
                </div>
                <div className="docs-contract-fns">
                  <h4>Key Functions</h4>
                  <div className="docs-fn-grid">
                    <div className="docs-fn"><code>createJob(provider, evaluator, expiredAt, description, paymentToken, budget)</code><span>Create a new on-chain job</span></div>
                    <div className="docs-fn"><code>getJob(jobId)</code><span>Returns job details by ID</span></div>
                    <div className="docs-fn"><code>jobCounter()</code><span>Current total job count</span></div>
                  </div>
                </div>
              </div>

              <div className="docs-callout" style={{ marginTop: '20px' }}>
                <div className="docs-callout-icon">↗</div>
                <div>
                  View contracts on{' '}
                  <a href="https://sepolia.basescan.org/address/0x7Ee0f29DBBc1b9826eaD2461C6f52a3BB66dEB36" target="_blank" rel="noopener noreferrer" className="docs-link">
                    BaseScan (Registry)
                  </a>{' '}
                  and{' '}
                  <a href="https://sepolia.basescan.org/address/0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B" target="_blank" rel="noopener noreferrer" className="docs-link">
                    BaseScan (ACP)
                  </a>.
                </div>
              </div>
            </section>

            {/* ── Integration Guide ── */}
            <section id="integration" className="docs-section">
              <div className="docs-section-eyebrow">04 — For Developers</div>
              <h2 className="docs-section-title">Integration Guide</h2>
              <p className="docs-section-desc">
                Integrate Evaxora's evaluator registry into your dApp using Wagmi, Viem, or Ethers.js.
              </p>

              <CodeBlock title="Read evaluators with Wagmi (React)">
{`import { useReadContract } from 'wagmi';
import { REGISTRY_ADDRESS, REGISTRY_ABI } from '@/lib/contract';

function MyComponent() {
  const { data: evaluators } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getAllEvaluators',
  });

  return evaluators?.map(e => (
    <div key={e.addr}>
      {e.name} — {e.domain} — {e.active ? 'Active' : 'Inactive'}
    </div>
  ));
}`}
              </CodeBlock>

              <CodeBlock title="Read evaluators with Viem (vanilla JS)">
{`import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const evaluators = await client.readContract({
  address: '0x7Ee0f29DBBc1b9826eaD2461C6f52a3BB66dEB36',
  abi: REGISTRY_ABI,
  functionName: 'getAllEvaluators',
});`}
              </CodeBlock>

              <CodeBlock title="Create a job with Wagmi">
{`import { useWriteContract } from 'wagmi';
import { ACP_ADDRESS, ACP_ABI } from '@/lib/contract';

const { writeContract } = useWriteContract();

writeContract({
  address: ACP_ADDRESS,
  abi: ACP_ABI,
  functionName: 'createJob',
  args: [
    providerAddress,           // address
    evaluatorAddress,          // address
    BigInt(expiryTimestamp),    // uint256
    'Audit smart contract',    // string
    '0x0000...0000',           // paymentToken (zero = no ERC20)
    BigInt(0),                 // budget
  ],
});`}
              </CodeBlock>
            </section>

            {/* ── Evaluator Types ── */}
            <section id="evaluator-types" className="docs-section">
              <div className="docs-section-eyebrow">05 — Taxonomy</div>
              <h2 className="docs-section-title">Evaluator Types</h2>
              <p className="docs-section-desc">
                The registry supports four categories of evaluators, each suited for different attestation needs.
              </p>

              <div className="docs-type-grid">
                <div className="docs-type-card">
                  <div className="docs-type-header">
                    <span className="docs-type-id mono">0</span>
                    <span className="docs-type-badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>AI Agent</span>
                  </div>
                  <p>Autonomous AI models that evaluate job outputs programmatically. Ideal for code reviews, content verification, data quality checks.</p>
                  <div className="docs-type-domains">
                    <span>Security</span><span>AI/ML</span><span>Code Review</span><span>NLP</span>
                  </div>
                </div>

                <div className="docs-type-card">
                  <div className="docs-type-header">
                    <span className="docs-type-id mono">1</span>
                    <span className="docs-type-badge" style={{ background: 'var(--success-subtle)', color: 'var(--success)', borderColor: 'rgba(0,214,143,0.3)' }}>ZK Verifier</span>
                  </div>
                  <p>Zero-knowledge proof verifiers that cryptographically attest computation correctness without revealing inputs.</p>
                  <div className="docs-type-domains">
                    <span>ZK Proofs</span><span>Privacy</span><span>Rollups</span><span>Identity</span>
                  </div>
                </div>

                <div className="docs-type-card">
                  <div className="docs-type-header">
                    <span className="docs-type-id mono">2</span>
                    <span className="docs-type-badge" style={{ background: 'rgba(255,179,71,0.1)', color: 'var(--warning)', borderColor: 'rgba(255,179,71,0.3)' }}>Multi-sig</span>
                  </div>
                  <p>Multi-signature committees where M-of-N signers must agree before attesting. Suited for high-value or governance-sensitive evaluations.</p>
                  <div className="docs-type-domains">
                    <span>DeFi</span><span>Treasury</span><span>Compliance</span><span>Legal</span>
                  </div>
                </div>

                <div className="docs-type-card">
                  <div className="docs-type-header">
                    <span className="docs-type-id mono">3</span>
                    <span className="docs-type-badge" style={{ background: 'var(--error-subtle)', color: 'var(--error)', borderColor: 'rgba(255,77,106,0.3)' }}>DAO</span>
                  </div>
                  <p>Decentralized autonomous organizations where token holders or delegates vote on job outcomes collectively.</p>
                  <div className="docs-type-domains">
                    <span>Governance</span><span>Grants</span><span>Community</span><span>Disputes</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Job Lifecycle ── */}
            <section id="job-lifecycle" className="docs-section">
              <div className="docs-section-eyebrow">06 — Workflow</div>
              <h2 className="docs-section-title">Job Lifecycle</h2>
              <p className="docs-section-desc">
                Every ERC-8183 job follows a deterministic state machine managed entirely by the smart contract.
              </p>

              <div className="docs-lifecycle">
                <div className="docs-lifecycle-step">
                  <div className="docs-lifecycle-badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>0</div>
                  <div className="docs-lifecycle-info">
                    <h4>Open</h4>
                    <p>Client creates the job with a description, assigns an evaluator, and optionally a provider. The job is now visible on-chain.</p>
                  </div>
                </div>
                <div className="docs-lifecycle-arrow">↓</div>

                <div className="docs-lifecycle-step">
                  <div className="docs-lifecycle-badge" style={{ background: 'rgba(0,150,255,0.1)', color: '#0096ff' }}>1</div>
                  <div className="docs-lifecycle-info">
                    <h4>Funded</h4>
                    <p>Client deposits payment into the escrow contract. Funds are locked and can only be released by the evaluator's attestation.</p>
                  </div>
                </div>
                <div className="docs-lifecycle-arrow">↓</div>

                <div className="docs-lifecycle-step">
                  <div className="docs-lifecycle-badge" style={{ background: 'rgba(255,179,71,0.1)', color: 'var(--warning)' }}>2</div>
                  <div className="docs-lifecycle-info">
                    <h4>Submitted</h4>
                    <p>Provider submits their work (deliverable hash on-chain). The evaluator is now responsible for reviewing and attesting.</p>
                  </div>
                </div>
                <div className="docs-lifecycle-arrow">↓</div>

                <div className="docs-lifecycle-step docs-lifecycle-split">
                  <div className="docs-lifecycle-branch">
                    <div className="docs-lifecycle-badge" style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}>3</div>
                    <div className="docs-lifecycle-info">
                      <h4>Completed ✓</h4>
                      <p>Evaluator attests completion. Funds auto-release to the provider. Reputation updated on-chain.</p>
                    </div>
                  </div>
                  <div className="docs-lifecycle-or mono">OR</div>
                  <div className="docs-lifecycle-branch">
                    <div className="docs-lifecycle-badge" style={{ background: 'var(--error-subtle)', color: 'var(--error)' }}>4</div>
                    <div className="docs-lifecycle-info">
                      <h4>Rejected ✗</h4>
                      <p>Evaluator rejects submission. Funds returned to client. Rejection reason recorded on-chain.</p>
                    </div>
                  </div>
                </div>

                <div className="docs-lifecycle-arrow" style={{ marginTop: '12px' }}>↓</div>
                <div className="docs-lifecycle-step">
                  <div className="docs-lifecycle-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)' }}>5</div>
                  <div className="docs-lifecycle-info">
                    <h4>Expired</h4>
                    <p>If the job passes its expiry timestamp without settlement, it enters the expired state. Funds can be reclaimed.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Architecture ── */}
            <section id="architecture" className="docs-section">
              <div className="docs-section-eyebrow">07 — Technical</div>
              <h2 className="docs-section-title">Architecture</h2>
              <p className="docs-section-desc">
                Overview of the Evaxora system design and technology stack.
              </p>

              <div className="docs-arch-grid">
                <div className="docs-arch-layer">
                  <div className="docs-arch-label mono">FRONTEND</div>
                  <div className="docs-arch-items">
                    <span>Next.js 16</span>
                    <span>React 19</span>
                    <span>Wagmi 3</span>
                    <span>RainbowKit</span>
                    <span>Viem</span>
                  </div>
                </div>
                <div className="docs-arch-connector">↕</div>
                <div className="docs-arch-layer">
                  <div className="docs-arch-label mono">BLOCKCHAIN</div>
                  <div className="docs-arch-items">
                    <span>Base Sepolia (L2)</span>
                    <span>Solidity ^0.8.20</span>
                    <span>Hardhat</span>
                    <span>OpenZeppelin</span>
                  </div>
                </div>
                <div className="docs-arch-connector">↕</div>
                <div className="docs-arch-layer">
                  <div className="docs-arch-label mono">CONTRACTS</div>
                  <div className="docs-arch-items">
                    <span>EvaxoraRegistry.sol</span>
                    <span>AgenticCommerce.sol</span>
                    <span>MockUSDC.sol</span>
                  </div>
                </div>
              </div>

              <CodeBlock title="Project Structure">
{`evaxora/
├── app/                    # Next.js App Router pages
│   ├── page.js             # Landing page
│   ├── globals.css         # All styles (design tokens + components)
│   ├── layout.js           # Root layout with providers
│   ├── registry/           # /registry — evaluator listing
│   ├── evaluator/[addr]/   # /evaluator/:addr — evaluator profile
│   ├── jobs/               # /jobs — job listing
│   ├── jobs/create/        # /jobs/create — create job form
│   ├── submit/             # /submit — register evaluator form
│   ├── dashboard/          # /dashboard — user dashboard
│   └── docs/               # /docs — this page
├── components/             # Shared React components
│   ├── Header.js           # Navigation header
│   ├── Footer.js           # Page footer
│   ├── Ticker.js           # Scrolling evaluator marquee
│   ├── EvaluatorCard.js    # Evaluator card component
│   └── Web3Providers.js    # Wagmi + RainbowKit config
├── contracts/              # Solidity smart contracts
├── scripts/                # Hardhat deploy & seed scripts
├── lib/
│   └── contract.js         # ABIs, addresses, constants
└── .env                    # RPC & private key config`}
              </CodeBlock>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="docs-section">
              <div className="docs-section-eyebrow">08 — Common Questions</div>
              <h2 className="docs-section-title">FAQ</h2>

              <div className="docs-faq-list">
                <details className="docs-faq-item">
                  <summary>What network is Evaxora deployed on?</summary>
                  <p>Evaxora is currently deployed on <strong>Base Sepolia</strong> testnet. Mainnet deployment is planned for a future release. You need Base Sepolia ETH for gas — use faucets linked in Getting Started.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>Do I need to pay to register an evaluator?</summary>
                  <p>No registration fee — only gas cost on Base Sepolia (free testnet ETH). The <code>registerEvaluator</code> function is permissionless; anyone can register.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>What does "Verified" mean on an evaluator?</summary>
                  <p>Verified status is set by the Evaxora contract owner via <code>setVerified()</code>. It indicates the evaluator has been reviewed and confirmed as legitimate. Unverified evaluators can still receive jobs.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>Can I use Evaxora evaluators in my own dApp?</summary>
                  <p>Yes! The registry is a public smart contract. Read the Integration Guide section for code examples using Wagmi, Viem, or Ethers.js.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>What happens if a job expires?</summary>
                  <p>If a job passes its <code>expiredAt</code> timestamp without being completed or rejected, it enters the Expired state (status 5). Any locked funds can be reclaimed by the client.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>How does the evaluator reputation system work?</summary>
                  <p>Every completion and rejection is recorded on-chain as an event (<code>JobCompleted</code>, <code>JobRejected</code>). This history is immutable and publicly queryable, forming a portable reputation for each evaluator.</p>
                </details>
                <details className="docs-faq-item">
                  <summary>Is there an API?</summary>
                  <p>No centralized API — all data comes directly from the blockchain. Use Wagmi, Viem, or Ethers.js to read contract state. This ensures the data source is decentralized and trustless.</p>
                </details>
              </div>
            </section>

            {/* ── Changelog ── */}
            <section id="changelog" className="docs-section">
              <div className="docs-section-eyebrow">09 — Updates</div>
              <h2 className="docs-section-title">Changelog</h2>

              <div className="docs-changelog">
                <div className="docs-changelog-entry">
                  <div className="docs-changelog-date mono">2026-03-25</div>
                  <div className="docs-changelog-ver">v0.1.0</div>
                  <div className="docs-changelog-body">
                    <h4>Initial Release</h4>
                    <ul>
                      <li>EvaxoraRegistry contract deployed on Base Sepolia</li>
                      <li>AgenticCommerce (ERC-8183) contract deployed</li>
                      <li>Landing page with live on-chain evaluator table</li>
                      <li>Registry page with search and filter</li>
                      <li>Evaluator profile pages</li>
                      <li>Job listing and creation</li>
                      <li>Evaluator registration form (on-chain)</li>
                      <li>User dashboard</li>
                      <li>Documentation page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Security ── */}
            <section id="security" className="docs-section">
              <div className="docs-section-eyebrow">10 — Trust & Safety</div>
              <h2 className="docs-section-title">Security</h2>
              <p className="docs-section-desc">
                Understanding the trust model, risk factors, and security considerations of Evaxora.
              </p>

              <div className="docs-security-grid">
                <div className="docs-security-item">
                  <h4>◈ Trust Model</h4>
                  <p>Evaxora does not custody funds. All escrow is handled by the AgenticCommerce smart contract. Evaluators only attest — they never hold funds.</p>
                </div>
                <div className="docs-security-item">
                  <h4>◈ Permissionless Registration</h4>
                  <p>Anyone can register as an evaluator. The "Verified" badge is an additional signal from the contract owner, but not required to receive jobs.</p>
                </div>
                <div className="docs-security-item">
                  <h4>◈ On-Chain Reputation</h4>
                  <p>Every attestation (completion or rejection) is an immutable on-chain event. Clients should evaluate an evaluator's history before assigning jobs.</p>
                </div>
                <div className="docs-security-item">
                  <h4>◈ Testnet Only</h4>
                  <p>Evaxora is currently deployed on Base Sepolia testnet. Contracts have not been audited. Do not use with real funds. Mainnet deployment will follow a security audit.</p>
                </div>
                <div className="docs-security-item">
                  <h4>◈ Owner Capabilities</h4>
                  <p>The contract owner can: verify/unverify evaluators, transfer ownership. The owner <strong>cannot</strong>: modify evaluator data, pause registration, or touch job funds.</p>
                </div>
                <div className="docs-security-item">
                  <h4>◈ Open Source</h4>
                  <p>All smart contracts and frontend code are open source. Contracts are verified on BaseScan for anyone to inspect.</p>
                </div>
              </div>

              <div className="docs-callout" style={{ borderColor: 'rgba(255,179,71,0.3)', background: 'rgba(255,179,71,0.05)' }}>
                <div className="docs-callout-icon">!</div>
                <div>
                  <strong>Disclaimer:</strong> Evaxora contracts are unaudited and deployed on testnet.
                  Use at your own risk. This is experimental software for demonstration purposes.
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
