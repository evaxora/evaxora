'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { REGISTRY_ADDRESS, REGISTRY_ABI, EVAL_TYPE_IDS, EVAL_TYPES } from '@/lib/contract';

const evaluatorTypes = [
  { id: 'ai-agent', label: 'AI Agent' },
  { id: 'zk-verifier', label: 'ZK Verifier' },
  { id: 'multi-sig', label: 'Multi-sig' },
  { id: 'dao', label: 'DAO' },
];

const domainCategories = [
  'Code Review',
  'Content Generation',
  'Data Analysis',
  'Smart Contract Audit',
  'Image Generation',
  'Portfolio Management',
  'Legal Review',
  'Translation',
  'ZK Proof Verification',
  'Trading Strategy',
];

export default function SubmitPage() {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    domain: '',
    description: '',
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Evaluator Registered', `Transaction confirmed: ${hash.slice(0, 10)}...${hash.slice(-6)}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error) {
      const msg = error.message?.includes('Already registered')
        ? 'This wallet is already registered as an evaluator.'
        : error.shortMessage || error.message;
      toast.error('Transaction Failed', msg);
    }
  }, [error]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnected) {
      toast.warning('Wallet Required', 'Please connect your wallet first.');
      return;
    }

    const evalTypeId = EVAL_TYPE_IDS[formData.type];
    if (evalTypeId === undefined) {
      toast.warning('Missing Field', 'Please select an evaluator type.');
      return;
    }

    toast.info('Submitting', 'Please confirm the transaction in your wallet.');

    writeContract({
      address: REGISTRY_ADDRESS,
      abi: REGISTRY_ABI,
      functionName: 'registerEvaluator',
      args: [formData.name, evalTypeId, formData.domain, formData.description],
    });
  };

  const previewReady = formData.name && formData.type && formData.domain;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="submit-page">
            <div className="submit-form-container">

              <div className="submit-header">
                <div className="section-eyebrow">Register</div>
                <h1 className="section-title">Submit an Evaluator</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px', lineHeight: 1.7 }}>
                  Register your evaluator on-chain to the Evaxora registry on Base Sepolia. 
                  Your wallet address ({isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'not connected'}) will be the evaluator address.
                </p>
              </div>

              {/* Success State */}
              {isSuccess && (
                <div style={{
                  padding: '20px',
                  border: '1px solid var(--success)',
                  borderRadius: '8px',
                  background: 'rgba(0, 255, 136, 0.05)',
                  marginBottom: '24px'
                }}>
                  <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '8px' }}>✓ Evaluator registered on-chain!</p>
                  <p className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Tx: <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>
                      {hash?.slice(0, 10)}...{hash?.slice(-8)}
                    </a>
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div style={{
                  padding: '16px',
                  border: '1px solid #ff4444',
                  borderRadius: '8px',
                  background: 'rgba(255, 68, 68, 0.05)',
                  marginBottom: '24px',
                  fontSize: '13px',
                  color: '#ff6666'
                }}>
                  {error.message?.includes('Already registered')
                    ? 'This wallet is already registered as an evaluator.'
                    : `Error: ${error.shortMessage || error.message}`}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Evaluator Address</label>
                  <input
                    type="text"
                    className="input mono"
                    value={isConnected ? address : 'Connect wallet to auto-fill'}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                  <p className="form-hint">Your connected wallet address will be used as the evaluator address.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Display Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Sentinel-7B"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    disabled={!isConnected}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Evaluator Type *</label>
                  <select
                    className="select"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                    disabled={!isConnected}
                  >
                    <option value="">Select type...</option>
                    {evaluatorTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Domain / Specialization *</label>
                  <select
                    className="select"
                    value={formData.domain}
                    onChange={(e) => handleChange('domain', e.target.value)}
                    required
                    disabled={!isConnected}
                  >
                    <option value="">Select domain...</option>
                    {domainCategories.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="textarea"
                    placeholder="Describe the evaluator's capabilities, methodology, and what types of jobs it's best suited for..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    disabled={!isConnected}
                  />
                </div>

                {!isConnected ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '16px',
                    border: '1px dashed var(--border-primary)',
                    borderRadius: '8px',
                    color: 'var(--text-tertiary)',
                    fontSize: '14px'
                  }}>
                    Connect your wallet to register an evaluator
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '8px' }}
                    disabled={isPending || isConfirming || isSuccess}
                  >
                    {isPending ? 'Confirm in wallet...' : isConfirming ? 'Transaction confirming...' : isSuccess ? '✓ Registered!' : 'Register Evaluator On-Chain'}
                  </button>
                )}
              </form>

              {/* Preview */}
              {previewReady && (
                <div className="preview-section">
                  <div className="preview-title">Registry Preview</div>
                  <div className="card evaluator-card" style={{ cursor: 'default' }}>
                    <div className="evaluator-card-header">
                      <div>
                        <div className="evaluator-card-name">{formData.name}</div>
                        <div className="evaluator-card-address mono">
                          {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0x0000...0000'}
                        </div>
                      </div>
                      {formData.type && (
                        <span className={`badge badge-${formData.type === 'ai-agent' ? 'ai' : formData.type === 'zk-verifier' ? 'zk' : formData.type === 'multi-sig' ? 'multisig' : 'dao'}`}>
                          {evaluatorTypes.find(t => t.id === formData.type)?.label}
                        </span>
                      )}
                    </div>
                    <div className="evaluator-card-domain">{formData.domain}</div>
                    <div className="evaluator-card-stats">
                      <div>
                        <div className="evaluator-card-stat-value">—</div>
                        <div className="evaluator-card-stat-label">Verified</div>
                      </div>
                      <div>
                        <div className="evaluator-card-stat-value">Active</div>
                        <div className="evaluator-card-stat-label">Status</div>
                      </div>
                      <div>
                        <div className="evaluator-card-stat-value">Today</div>
                        <div className="evaluator-card-stat-label">Registered</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
