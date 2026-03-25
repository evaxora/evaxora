'use client';

import { use } from 'react';
import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { REGISTRY_ADDRESS, REGISTRY_ABI, EVAL_TYPES, ACP_ADDRESS, ACP_ABI, JOB_STATUSES, JOB_STATUS_CLASSES } from '@/lib/contract';

export default function EvaluatorDetailPage({ params }) {
  const { address } = use(params);
  const [jobs, setJobs] = useState([]);

  // Read evaluator profile
  const { data: evaluator, isLoading: evalLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getEvaluator',
    args: [address],
  });

  // Read job count
  const { data: jobCounter } = useReadContract({
    address: ACP_ADDRESS,
    abi: ACP_ABI,
    functionName: 'jobCounter',
  });

  const totalJobs = jobCounter ? Number(jobCounter) : 0;

  // Read all jobs
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
    if (jobResults) {
      const all = jobResults.filter(r => r.status === 'success' && r.result).map(r => r.result);
      const evaluatorJobs = all.filter(j =>
        j.evaluator?.toLowerCase() === address?.toLowerCase() ||
        j.client?.toLowerCase() === address?.toLowerCase() ||
        j.provider?.toLowerCase() === address?.toLowerCase()
      );
      setJobs(evaluatorJobs);
    }
  }, [jobResults, address]);

  const isRegistered = evaluator && evaluator.addr !== '0x0000000000000000000000000000000000000000';
  const addr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—';

  // Stats
  const asEvaluator = jobs.filter(j => j.evaluator?.toLowerCase() === address?.toLowerCase());
  const completed = asEvaluator.filter(j => Number(j.status) === 3).length;
  const rejected = asEvaluator.filter(j => Number(j.status) === 4).length;
  const rate = completed + rejected > 0 ? Math.round((completed / (completed + rejected)) * 100) : null;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">

          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <Link href="/registry" className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>← Back to Registry</Link>
          </div>

          {evalLoading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-tertiary)' }}>Loading evaluator data...</div>
          ) : !isRegistered ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Not Registered</h2>
              <p className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>{address}</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>This address is not registered as an evaluator.</p>
              <Link href="/submit" className="btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>Register as Evaluator →</Link>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{evaluator.name}</h1>
                      {evaluator.verified && <span className="s-pill s-completed">Verified</span>}
                      {evaluator.active ? <span className="s-pill s-open">Active</span> : <span className="s-pill s-expired">Inactive</span>}
                    </div>
                    <p className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>{address}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px', lineHeight: 1.7 }}>{evaluator.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="type-tag">{EVAL_TYPES[evaluator.evalType]}</span>
                    <span className="type-tag">{evaluator.domain}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
                  <div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Registered</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{new Date(Number(evaluator.registeredAt) * 1000).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jobs Evaluated</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{asEvaluator.length}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Completed</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px', color: 'var(--success)' }}>{completed}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rejected</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px', color: '#ff4466' }}>{rejected}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Success Rate</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{rate !== null ? `${rate}%` : '—'}</div>
                  </div>
                </div>
              </div>

              {/* Jobs Table */}
              <div style={{ marginBottom: '16px' }}>
                <div className="section-eyebrow">ON-CHAIN ACTIVITY</div>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Related Jobs ({jobs.length})</h2>
              </div>

              <div className="landing-tbl-section">
                <div className="tbl-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Description</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No jobs found for this address</td></tr>
                      ) : (
                        jobs.map(job => {
                          const status = Number(job.status);
                          const role = job.evaluator?.toLowerCase() === address?.toLowerCase() ? 'Evaluator'
                            : job.client?.toLowerCase() === address?.toLowerCase() ? 'Client' : 'Provider';
                          return (
                            <tr key={job.id.toString()}>
                              <td className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>#{job.id.toString()}</td>
                              <td style={{ maxWidth: '320px' }}>
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

              {/* BaseScan Link */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a href={`https://sepolia.basescan.org/address/${address}`} target="_blank" rel="noopener" className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  View on BaseScan ↗
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
