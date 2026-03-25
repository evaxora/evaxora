'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { REGISTRY_ADDRESS, REGISTRY_ABI, EVAL_TYPES, ACP_ADDRESS, ACP_ABI, JOB_STATUSES, JOB_STATUS_CLASSES } from '@/lib/contract';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [myJobs, setMyJobs] = useState([]);

  // Read evaluator profile
  const { data: evaluator } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getEvaluator',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read job count
  const { data: jobCounter } = useReadContract({
    address: ACP_ADDRESS,
    abi: ACP_ABI,
    functionName: 'jobCounter',
  });

  const totalJobs = jobCounter ? Number(jobCounter) : 0;

  const jobReads = totalJobs > 0
    ? Array.from({ length: totalJobs }, (_, i) => ({
        address: ACP_ADDRESS,
        abi: ACP_ABI,
        functionName: 'getJob',
        args: [BigInt(i + 1)],
      }))
    : [];

  const { data: jobResults } = useReadContracts({ contracts: jobReads });

  useEffect(() => {
    if (jobResults && address) {
      const all = jobResults.filter(r => r.status === 'success' && r.result).map(r => r.result);
      const mine = all.filter(j =>
        j.client?.toLowerCase() === address.toLowerCase() ||
        j.provider?.toLowerCase() === address.toLowerCase() ||
        j.evaluator?.toLowerCase() === address.toLowerCase()
      );
      setMyJobs(mine);
    }
  }, [jobResults, address]);

  const isRegistered = evaluator && evaluator.addr !== '0x0000000000000000000000000000000000000000';
  const addr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—';

  // My job stats
  const asClient = myJobs.filter(j => j.client?.toLowerCase() === address?.toLowerCase());
  const asEvaluator = myJobs.filter(j => j.evaluator?.toLowerCase() === address?.toLowerCase());
  const asProvider = myJobs.filter(j => j.provider?.toLowerCase() === address?.toLowerCase());

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">

          {!isConnected ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🔒</div>
              <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>Connect Your Wallet</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Connect your wallet to view your dashboard, evaluator profile, and job activity.</p>
            </div>
          ) : (
            <>
              <div className="registry-header">
                <div>
                  <div className="section-eyebrow">DASHBOARD</div>
                  <h1 className="section-title">My Account</h1>
                  <p className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{address}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <Link href="/jobs/create" className="btn-primary" style={{ fontSize: '13px' }}>+ Create Job</Link>
                {!isRegistered && <Link href="/submit" className="btn-secondary" style={{ fontSize: '13px' }}>Register as Evaluator</Link>}
                <a href={`https://sepolia.basescan.org/address/${address}`} target="_blank" rel="noopener" className="btn-secondary" style={{ fontSize: '13px' }}>View on BaseScan ↗</a>
              </div>

              {/* Evaluator Profile Card */}
              <div style={{ marginBottom: '32px' }}>
                <div className="section-eyebrow">EVALUATOR PROFILE</div>
                {isRegistered ? (
                  <div className="card" style={{ padding: '24px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{evaluator.name}</h3>
                          {evaluator.verified && <span className="s-pill s-completed">Verified</span>}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', maxWidth: '500px' }}>{evaluator.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span className="type-tag">{EVAL_TYPES[evaluator.evalType]}</span>
                        <span className="type-tag">{evaluator.domain}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <Link href={`/evaluator/${address}`} style={{ fontSize: '12px', color: 'var(--accent)' }}>View full profile →</Link>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ padding: '24px', marginTop: '8px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginBottom: '12px' }}>You are not registered as an evaluator yet.</p>
                    <Link href="/submit" className="btn-primary" style={{ fontSize: '13px' }}>Register Now →</Link>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                <StatCard label="Total Jobs" value={myJobs.length} />
                <StatCard label="As Client" value={asClient.length} />
                <StatCard label="As Evaluator" value={asEvaluator.length} />
                <StatCard label="As Provider" value={asProvider.length} />
              </div>

              {/* My Jobs Table */}
              <div style={{ marginBottom: '16px' }}>
                <div className="section-eyebrow">MY JOBS</div>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Job Activity</h2>
              </div>

              <div className="landing-tbl-section">
                <div className="tbl-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Description</th>
                        <th>My Role</th>
                        <th>Status</th>
                        <th>Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myJobs.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                          No jobs found. <Link href="/jobs/create" style={{ color: 'var(--accent)' }}>Create your first job →</Link>
                        </td></tr>
                      ) : (
                        [...myJobs].reverse().map(job => {
                          const status = Number(job.status);
                          const role = job.evaluator?.toLowerCase() === address?.toLowerCase() ? 'Evaluator'
                            : job.client?.toLowerCase() === address?.toLowerCase() ? 'Client' : 'Provider';
                          return (
                            <tr key={job.id.toString()}>
                              <td className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>#{job.id.toString()}</td>
                              <td style={{ maxWidth: '280px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.description}</div>
                              </td>
                              <td><span className="type-tag">{role}</span></td>
                              <td><span className={`s-pill ${JOB_STATUS_CLASSES[status]}`}>{JOB_STATUSES[status]}</span></td>
                              <td className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{new Date(Number(job.expiredAt) * 1000).toLocaleDateString()}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
