'use client';

import { EVAL_TYPES } from '@/lib/contract';

export default function Ticker({ evaluators = [] }) {
  // If no evaluators, show placeholder items
  const items = evaluators.length > 0
    ? [...evaluators, ...evaluators, ...evaluators, ...evaluators]
    : Array(16).fill(null).map((_, i) => ({
        name: ['Sentinel-7B', 'zkVerify-Core', 'AuditVault', 'ProofEngine'][i % 4],
        evalType: i % 4,
        active: true,
      }));

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((e, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-dot" />
            <span className="ticker-name">{e.name}</span>
            <span className="ticker-score">{EVAL_TYPES[e.evalType]}</span>
            <span className="ticker-rate">{e.active ? 'Active' : 'Off'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
