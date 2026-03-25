'use client';

import { useReadContract } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import Link from 'next/link';
import { REGISTRY_ADDRESS, REGISTRY_ABI, EVAL_TYPES } from '@/lib/contract';

export default function Home() {
  const { data: evaluators, isLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getAllEvaluators',
  });

  const { data: evaluatorCount } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'evaluatorCount',
  });

  const list = evaluators || [];
  const activeCount = list.filter(e => e.active).length;
  const topEval = list.length > 0 ? [...list].sort((a, b) => Number(b.registeredAt) - Number(a.registeredAt))[0] : null;

  return (
    <div className="page-wrapper">
      <Header />
      <Ticker evaluators={list} />

      <main style={{ flex: 1 }}>
        {/* ── SPLIT HERO ── */}
        <section className="hero-split">
          <div className="hero-split-left">
            <p className="eyebrow">ERC-8183 · Trust Infrastructure</p>
            <h1>The evaluation<br /><span className="hero-accent">layer</span>{' '}for<br />agent commerce.</h1>
            <p className="hero-desc">
              Discover and compare evaluators that attest ERC-8183 jobs.
              Every ranking is derived from on-chain history — no curation, no gatekeeping.
            </p>
            <div className="hero-btns">
              <Link href="/registry"><button className="btn-ink">Browse registry →</button></Link>
              <Link href="/submit"><button className="btn-ghost">Register evaluator</button></Link>
            </div>
          </div>

          <div className="hero-split-right">
            {/* Stats Grid */}
            <div className="hero-stats-grid">
              <div className="hero-stat-b">
                <div className="hero-stat-v">{evaluatorCount !== undefined ? Number(evaluatorCount) : '—'}</div>
                <div className="hero-stat-l">Evaluators</div>
              </div>
              <div className="hero-stat-b">
                <div className="hero-stat-v">{activeCount || '—'}</div>
                <div className="hero-stat-l">Active</div>
              </div>
              <div className="hero-stat-b">
                <div className="hero-stat-v">ERC-8183</div>
                <div className="hero-stat-l">Standard</div>
              </div>
              <div className="hero-stat-b">
                <div className="hero-stat-v">Base</div>
                <div className="hero-stat-l">Network</div>
              </div>
            </div>

            {/* Top Evaluator Card */}
            <div className="top-eval">
              {topEval ? (
                <>
                  <p className="eyebrow" style={{ marginBottom: '12px' }}>Latest evaluator</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        {topEval.name}
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                        {topEval.addr.slice(0, 6)}…{topEval.addr.slice(-4)}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <span className="type-tag">{EVAL_TYPES[topEval.evalType]}</span>
                        <span className="type-tag">{topEval.domain}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                      <div style={{ fontSize: '11px', color: topEval.verified ? 'var(--success)' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                        {topEval.verified ? '✓ VERIFIED' : 'UNVERIFIED'}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '24px' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '14px', fontWeight: 500 }}>{topEval.active ? 'Active' : 'Inactive'}</div>
                      <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginTop: '2px' }}>STATUS</div>
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '14px', fontWeight: 500 }}>{new Date(Number(topEval.registeredAt) * 1000).toLocaleDateString()}</div>
                      <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', marginTop: '2px' }}>REGISTERED</div>
                    </div>
                  </div>
                </>
              ) : isLoading ? (
                <div style={{ padding: '16px 0' }}>
                  <div className="skeleton skeleton-text-sm" style={{ width: '100px', marginBottom: '16px' }} />
                  <div className="skeleton skeleton-heading" style={{ width: '140px' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '100px' }} />
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <div className="skeleton skeleton-badge" />
                    <div className="skeleton skeleton-badge" />
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '24px' }}>
                    <div className="skeleton skeleton-text" style={{ width: '60px' }} />
                    <div className="skeleton skeleton-text" style={{ width: '80px' }} />
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-tertiary)' }}>
                  No evaluators registered yet
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── EVALUATOR TABLE ── */}
        <div className="landing-section-head">
          <div>
            <p className="eyebrow" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Live registry</p>
            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>On-chain evaluators</h2>
          </div>
          <Link href="/registry">
            <button className="btn-ghost" style={{ fontSize: '12px', padding: '7px 14px' }}>Full registry ↗</button>
          </Link>
        </div>

        <div className="landing-tbl-section">
          <div className="tbl-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Evaluator</th>
                  <th>Type</th>
                  <th>Domain</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton" style={{ height: '12px', width: '20px' }} /></td>
                      <td>
                        <div className="skeleton" style={{ height: '14px', width: '100px', marginBottom: '4px' }} />
                        <div className="skeleton" style={{ height: '10px', width: '70px' }} />
                      </td>
                      <td><div className="skeleton skeleton-badge" /></td>
                      <td><div className="skeleton" style={{ height: '12px', width: '60px' }} /></td>
                      <td><div className="skeleton skeleton-badge" style={{ width: '50px' }} /></td>
                    </tr>
                  ))
                ) : list.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No evaluators registered yet. Be the first!</td></tr>
                ) : (
                  list.map((e, i) => (
                    <tr key={e.addr}>
                      <td className="mono" style={{ fontSize: '10px', color: 'var(--text-tertiary)', width: '40px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 500, fontSize: '13px', color: 'var(--text-primary)' }}>
                          {e.name}
                          {e.verified && <span className="verified-badge">VERIFIED</span>}
                        </div>
                        <div className="mono" style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {e.addr.slice(0, 6)}…{e.addr.slice(-4)}
                        </div>
                      </td>
                      <td><span className="type-tag">{EVAL_TYPES[e.evalType]}</span></td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{e.domain}</td>
                      <td><span className={`s-pill ${e.active ? 's-active' : 's-review'}`}>{e.active ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── HOW IT WORKS (FLOW) ── */}
        <div className="flow-section">
          <div className="flow-inner">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p className="eyebrow" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Protocol</p>
                <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>How ERC-8183 settlement works</h2>
              </div>
              <a href="https://eips.ethereum.org/EIPS/eip-8183" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost" style={{ fontSize: '11px', padding: '6px 12px' }}>Read spec ↗</button>
              </a>
            </div>
            <div className="flow-wrap">
              <div className="flow-node">
                <div className="flow-state mono">OPEN</div>
                <div className="flow-num">01</div>
                <div className="flow-title">Job created</div>
                <div className="flow-desc">Client defines the task, sets terms, and assigns a provider. Job spec is recorded immutably on-chain.</div>
              </div>
              <div className="flow-node">
                <div className="flow-state mono">FUNDED</div>
                <div className="flow-num">02</div>
                <div className="flow-title">Escrow locked</div>
                <div className="flow-desc">Payment secured in a trustless smart contract. Code is the neutral enforcer — no platform holds your funds.</div>
              </div>
              <div className="flow-node">
                <div className="flow-state mono">SUBMITTED</div>
                <div className="flow-num">03</div>
                <div className="flow-title">Work delivered</div>
                <div className="flow-desc">Provider submits a verifiable deliverable hash on-chain. Permanent record protecting both parties.</div>
              </div>
              <div className="flow-node">
                <div className="flow-state mono">TERMINAL</div>
                <div className="flow-num">04</div>
                <div className="flow-title">Evaluator attests</div>
                <div className="flow-desc">Evaluator calls complete or reject. Funds release automatically. Every attestation builds on-chain reputation.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="cta-new">
          <div className="cta-new-inner">
            <div>
              <p className="eyebrow" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '10px' }}>For builders</p>
              <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '10px' }}>Built an evaluator?</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.75, fontWeight: 300 }}>
                Register it on Evaxora and start receiving ERC-8183 jobs.
                Your on-chain reputation grows with every attestation — portable, verifiable, owned by you.
              </p>
            </div>
            <Link href="/submit">
              <button className="btn-ink" style={{ fontSize: '14px', padding: '13px 28px' }}>Register your evaluator →</button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
