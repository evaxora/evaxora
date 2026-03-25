'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { ACP_ADDRESS, ACP_ABI, REGISTRY_ADDRESS, REGISTRY_ABI } from '@/lib/contract';

export default function CreateJobPage() {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const [form, setForm] = useState({
    provider: '',
    evaluator: '',
    description: '',
    expiryDays: '30',
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read evaluators for the dropdown
  const { data: evaluators } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getAllEvaluators',
  });

  const activeEvaluators = (evaluators || []).filter(e => e.active);

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Job Created', `Transaction confirmed: ${hash.slice(0, 10)}...${hash.slice(-6)}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error) {
      toast.error('Transaction Failed', error.shortMessage || error.message);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnected) {
      toast.warning('Wallet Required', 'Please connect your wallet first.');
      return;
    }

    toast.info('Creating Job', 'Please confirm the transaction in your wallet.');

    const expiredAt = BigInt(Math.floor(Date.now() / 1000) + Number(form.expiryDays) * 86400);
    const zeroAddr = '0x0000000000000000000000000000000000000000';

    writeContract({
      address: ACP_ADDRESS,
      abi: ACP_ABI,
      functionName: 'createJob',
      args: [
        form.provider || zeroAddr,
        form.evaluator,
        expiredAt,
        form.description,
        zeroAddr, // paymentToken (no ERC20 for now)
        BigInt(0), // budget
      ],
    });
  };

  const u = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container" style={{ maxWidth: '680px' }}>

          <div style={{ marginBottom: '8px' }}>
            <Link href="/jobs" className="mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>← Back to Jobs</Link>
          </div>

          <div className="section-eyebrow">ERC-8183</div>
          <h1 className="section-title" style={{ marginBottom: '8px' }}>Create Job</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginBottom: '32px' }}>
            Post an on-chain job request. Assign an evaluator to attest completion.
          </p>

          {isSuccess ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Job Created!</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginBottom: '16px' }}>Transaction confirmed on Base Sepolia.</p>
              <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener" className="mono" style={{ fontSize: '11px', color: 'var(--accent)' }}>
                View on BaseScan ↗
              </a>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/jobs" className="btn-primary">View Jobs →</Link>
                <button className="btn-secondary" onClick={() => { setForm({ provider: '', evaluator: '', description: '', expiryDays: '30' }); }}>Create Another</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-card">

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Describe what needs to be done and evaluated..."
                  value={form.description}
                  onChange={u('description')}
                  required
                />
              </div>

              {/* Evaluator */}
              <div className="form-group">
                <label className="form-label">Evaluator</label>
                {activeEvaluators.length > 0 ? (
                  <select className="input" value={form.evaluator} onChange={u('evaluator')} required>
                    <option value="">Select an evaluator...</option>
                    {activeEvaluators.map(ev => (
                      <option key={ev.addr} value={ev.addr}>
                        {ev.name} — {ev.domain} ({ev.addr.slice(0, 6)}...{ev.addr.slice(-4)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="input mono" type="text" placeholder="0x... evaluator address" value={form.evaluator} onChange={u('evaluator')} required />
                )}
                <span className="form-hint">The evaluator will attest job completion or rejection.</span>
              </div>

              {/* Provider */}
              <div className="form-group">
                <label className="form-label">Provider (optional)</label>
                <input className="input mono" type="text" placeholder="0x... provider address (leave empty to assign later)" value={form.provider} onChange={u('provider')} />
                <span className="form-hint">The agent or address that will perform the work.</span>
              </div>

              {/* Expiry */}
              <div className="form-group">
                <label className="form-label">Expiry (days from now)</label>
                <input className="input" type="number" min="1" max="365" value={form.expiryDays} onChange={u('expiryDays')} required />
              </div>

              {/* Wallet Info */}
              <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Client: </span>
                <span className="mono" style={{ color: 'var(--text-secondary)' }}>{isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect wallet first'}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14px' }}
                disabled={!isConnected || isPending || isConfirming}
              >
                {!isConnected ? 'Connect Wallet First' : isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming tx...' : 'Create Job On-Chain'}
              </button>

              {error && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--error-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: '#ff4466' }}>
                  {error.shortMessage || error.message}
                </div>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
