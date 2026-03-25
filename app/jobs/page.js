'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ACP_ADDRESS, ACP_ABI, REGISTRY_ADDRESS, REGISTRY_ABI, JOB_STATUSES, JOB_STATUS_CLASSES } from '@/lib/contract';

const statusFilters = [
  { id: 'all', label: 'All Jobs' },
  { id: 0, label: 'Open' },
  { id: 1, label: 'Funded' },
  { id: 2, label: 'Submitted' },
  { id: 3, label: 'Completed' },
  { id: 4, label: 'Rejected' },
];

export default function JobsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobs, setJobs] = useState([]);

  const { data: jobCounter, isLoading: counterLoading } = useReadContract({
    address: ACP_ADDRESS,
    abi: ACP_ABI,
    functionName: 'jobCounter',
    query: { refetchInterval: 10000 },
  });

  const totalJobs = jobCounter ? Number(jobCounter) : 0;

  // Create read calls for each job
  const jobReads = totalJobs > 0
    ? Array.from({ length: totalJobs }, (_, i) => ({
        address: ACP_ADDRESS,
        abi: ACP_ABI,
        functionName: 'getJob',
        args: [BigInt(i + 1)],
      }))
    : [];

  const { data: jobResults, isLoading: jobsLoading } = useReadContracts({
    contracts: jobReads,
  });

  useEffect(() => {
    if (jobResults) {
      const parsed = jobResults
        .filter(r => r.status === 'success' && r.result)
        .map(r => r.result);
      setJobs(parsed);
    }
  }, [jobResults]);

  const isLoading = counterLoading || jobsLoading;

  const filteredJobs = filterStatus === 'all'
    ? jobs
    : jobs.filter(j => Number(j.status) === filterStatus);

  const statusCounts = {};
  jobs.forEach(j => {
    const s = Number(j.status);
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const addr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—';

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">

          {/* Header */}
          <div className="registry-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <div className="section-eyebrow">ERC-8183</div>
                <h1 className="section-title">Live Jobs</h1>
              </div>
              <Link href="/jobs/create" className="btn-ghost" style={{ fontSize: '12px', padding: '8px 16px', letterSpacing: '0.02em' }}>Post Job →</Link>
            </div>
            <div className="job-stats-bar">
              <div className="job-stat-chip">
                <span className="job-stat-num">{totalJobs}</span>
                <span className="job-stat-label">Total</span>
              </div>
              <div className="job-stat-chip">
                <span className="job-stat-num">{statusCounts[3] || 0}</span>
                <span className="job-stat-label">Completed</span>
              </div>
              <div className="job-stat-chip">
                <span className="job-stat-num">{(statusCounts[0] || 0) + (statusCounts[1] || 0) + (statusCounts[2] || 0)}</span>
                <span className="job-stat-label">Active</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="search-filter-bar">
            <div className="filter-group">
              {statusFilters.map(f => (
                <button
                  key={f.id}
                  className={`filter-btn ${filterStatus === f.id ? 'active' : ''}`}
                  onClick={() => setFilterStatus(f.id)}
                >
                  {f.label}
                  {f.id !== 'all' && statusCounts[f.id] !== undefined && (
                    <span className="filter-count">{statusCounts[f.id]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Table */}
          <div className="landing-tbl-section">
            <div className="tbl-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Description</th>
                    <th>Client</th>
                    <th>Provider</th>
                    <th>Evaluator</th>
                    <th>Status</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>Loading jobs from Base Sepolia...</td></tr>
                  ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                      {jobs.length === 0 ? 'No jobs created yet' : 'No jobs match this filter'}
                    </td></tr>
                  ) : (
                    [...filteredJobs].reverse().map((job) => {
                      const status = Number(job.status);
                      const expiry = new Date(Number(job.expiredAt) * 1000);
                      const isExpired = expiry < new Date() && status < 3;
                      return (
                        <tr key={job.id.toString()}>
                          <td className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                            #{job.id.toString()}
                          </td>
                          <td style={{ maxWidth: '280px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {job.description}
                            </div>
                          </td>
                          <td className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{addr(job.client)}</td>
                          <td className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{addr(job.provider)}</td>
                          <td className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{addr(job.evaluator)}</td>
                          <td>
                            <span className={`s-pill ${JOB_STATUS_CLASSES[status]}`}>
                              {isExpired ? 'Expired' : JOB_STATUSES[status]}
                            </span>
                          </td>
                          <td className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            {expiry.toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluator Stats Section */}
          <div style={{ marginTop: '48px', marginBottom: '32px' }}>
            <div className="section-eyebrow">Analytics</div>
            <h2 className="section-title" style={{ fontSize: '22px' }}>Evaluator Performance</h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '6px' }}>
              Derived from on-chain job completion and rejection events.
            </p>
          </div>

          <EvaluatorStats jobs={jobs} />

        </div>
      </main>
      <Footer />
    </div>
  );
}

function EvaluatorStats({ jobs }) {
  // Compute stats per evaluator address
  const stats = {};
  jobs.forEach(job => {
    const evaluator = job.evaluator;
    if (!stats[evaluator]) {
      stats[evaluator] = { address: evaluator, completed: 0, rejected: 0, total: 0 };
    }
    stats[evaluator].total++;
    if (Number(job.status) === 3) stats[evaluator].completed++;
    if (Number(job.status) === 4) stats[evaluator].rejected++;
  });

  const evaluatorList = Object.values(stats);

  if (evaluatorList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)', border: '1px dashed var(--border-primary)', borderRadius: '8px' }}>
        No evaluator stats available yet
      </div>
    );
  }

  return (
    <div className="evaluator-grid">
      {evaluatorList.map(ev => {
        const rate = ev.completed + ev.rejected > 0
          ? Math.round((ev.completed / (ev.completed + ev.rejected)) * 100)
          : null;
        return (
          <div key={ev.address} className="card" style={{ padding: '20px' }}>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              {ev.address.slice(0, 6)}…{ev.address.slice(-4)}
            </div>
            <div className="evaluator-card-stats">
              <div>
                <div className="evaluator-card-stat-value">{ev.total}</div>
                <div className="evaluator-card-stat-label">Jobs</div>
              </div>
              <div>
                <div className="evaluator-card-stat-value" style={{ color: 'var(--success)' }}>{ev.completed}</div>
                <div className="evaluator-card-stat-label">Completed</div>
              </div>
              <div>
                <div className="evaluator-card-stat-value" style={{ color: '#ff4466' }}>{ev.rejected}</div>
                <div className="evaluator-card-stat-label">Rejected</div>
              </div>
              <div>
                <div className="evaluator-card-stat-value">{rate !== null ? `${rate}%` : '—'}</div>
                <div className="evaluator-card-stat-label">Rate</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
