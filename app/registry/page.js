'use client';

import { useState, useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { isAddress } from 'viem';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { REGISTRY_ADDRESS, REGISTRY_ABI, EVAL_TYPES } from '@/lib/contract';
import Link from 'next/link';

const evaluatorTypes = [
  { id: 'all', label: 'All Types' },
  { id: 0, label: 'AI Agent' },
  { id: 1, label: 'ZK Verifier' },
  { id: 2, label: 'Multi-sig' },
  { id: 3, label: 'DAO' },
];

export default function RegistryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [addressSearch, setAddressSearch] = useState('');

  // Direct address lookup
  const isValidAddress = addressSearch && isAddress(addressSearch);
  const { data: addressResult } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getEvaluator',
    args: isValidAddress ? [addressSearch] : undefined,
    query: { enabled: isValidAddress },
  });

  const { data: evaluators, isLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getAllEvaluators',
    query: { refetchInterval: 10000 },
  });

  const list = evaluators || [];

  const filteredEvaluators = useMemo(() => {
    let result = [...list];

    // Filter by type
    if (activeType !== 'all') {
      result = result.filter(e => e.evalType === activeType);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.domain.toLowerCase().includes(query) ||
        e.addr.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => Number(b.registeredAt) - Number(a.registeredAt));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [list, searchQuery, activeType, sortBy]);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">

          <div className="registry-header">
            <h1 className="section-title">Evaluator Registry</h1>
            <p className="registry-count">
              {isLoading ? 'Loading...' : `${filteredEvaluators.length} evaluator${filteredEvaluators.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Address Lookup */}
          <div className="address-search-box">
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>🔍</span>
            <input
              type="text"
              className="input mono"
              placeholder="Lookup by wallet address (0x...)"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value.trim())}
            />
            {addressSearch && !isValidAddress && (
              <span style={{ fontSize: '10px', color: '#ff4466' }}>Invalid address</span>
            )}
          </div>

          {isValidAddress && addressResult && addressResult.addr !== '0x0000000000000000000000000000000000000000' && (
            <div className="address-search-result">
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>FOUND ON-CHAIN</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{addressResult.name}</div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{addressResult.addr}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="type-tag">{EVAL_TYPES[addressResult.evalType]}</span>
                  <span className="type-tag">{addressResult.domain}</span>
                  <span className={`s-pill ${addressResult.verified ? 's-completed' : 's-open'}`}>{addressResult.verified ? 'Verified' : 'Unverified'}</span>
                </div>
              </div>
            </div>
          )}

          {isValidAddress && addressResult && addressResult.addr === '0x0000000000000000000000000000000000000000' && (
            <div style={{ padding: '12px 16px', border: '1px dashed var(--border-primary)', borderRadius: '8px', marginBottom: '16px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              This address is not registered as an evaluator. <Link href="/submit" style={{ color: 'var(--accent-primary)' }}>Register it →</Link>
            </div>
          )}

          {/* Search & Filter */}
          <div className="search-filter-bar">
            <div className="input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
              <span className="input-icon">⌕</span>
              <input
                type="text"
                className="input input-with-icon"
                placeholder="Search by name, domain, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              {evaluatorTypes.map(type => (
                <button
                  key={type.id}
                  className={`filter-btn ${activeType === type.id ? 'active' : ''}`}
                  onClick={() => setActiveType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <select
              className="select"
              style={{ width: '160px', flexShrink: 0 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Evaluator Grid */}
          <div className="evaluator-grid">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card evaluator-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div className="skeleton" style={{ height: '16px', width: '110px', marginBottom: '6px' }} />
                      <div className="skeleton" style={{ height: '10px', width: '80px' }} />
                    </div>
                    <div className="skeleton skeleton-badge" />
                  </div>
                  <div className="skeleton" style={{ height: '12px', width: '70px', marginBottom: '12px' }} />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                  <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-primary)' }}>
                    <div className="skeleton" style={{ height: '12px', width: '30px' }} />
                    <div className="skeleton" style={{ height: '12px', width: '40px' }} />
                    <div className="skeleton" style={{ height: '12px', width: '60px' }} />
                  </div>
                </div>
              ))
            ) : filteredEvaluators.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-tertiary)', gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>No evaluators found</p>
                <p style={{ fontSize: '14px' }}>
                  {list.length === 0 ? (
                    <Link href="/submit" style={{ color: 'var(--accent-primary)' }}>Be the first to register →</Link>
                  ) : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              filteredEvaluators.map((evaluator) => (
                <Link href={`/evaluator/${evaluator.addr}`} key={evaluator.addr} className="card evaluator-card" style={{ textDecoration: 'none' }}>
                  <div className="evaluator-card-header">
                    <div>
                      <div className="evaluator-card-name">{evaluator.name}</div>
                      <div className="evaluator-card-address mono">
                        {evaluator.addr.slice(0, 6)}...{evaluator.addr.slice(-4)}
                      </div>
                    </div>
                    <span className={`badge badge-${evaluator.evalType === 0 ? 'ai' : evaluator.evalType === 1 ? 'zk' : evaluator.evalType === 2 ? 'multisig' : 'dao'}`}>
                      {EVAL_TYPES[evaluator.evalType]}
                    </span>
                  </div>
                  <div className="evaluator-card-domain">{evaluator.domain}</div>
                  {evaluator.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.6 }}>
                      {evaluator.description.length > 120 ? evaluator.description.slice(0, 120) + '...' : evaluator.description}
                    </p>
                  )}
                  <div className="evaluator-card-stats">
                    <div>
                      <div className="evaluator-card-stat-value">{evaluator.verified ? '✓' : '—'}</div>
                      <div className="evaluator-card-stat-label">Verified</div>
                    </div>
                    <div>
                      <div className="evaluator-card-stat-value">{evaluator.active ? 'Active' : 'Off'}</div>
                      <div className="evaluator-card-stat-label">Status</div>
                    </div>
                    <div>
                      <div className="evaluator-card-stat-value">{new Date(Number(evaluator.registeredAt) * 1000).toLocaleDateString()}</div>
                      <div className="evaluator-card-stat-label">Registered</div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
