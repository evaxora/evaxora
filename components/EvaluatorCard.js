'use client';

import Link from 'next/link';

function getBadgeClass(type) {
  const map = {
    'ai-agent': 'badge-ai',
    'zk-verifier': 'badge-zk',
    'multi-sig': 'badge-multisig',
    'dao': 'badge-dao',
  };
  return map[type] || 'badge-ai';
}

function getTypeLabel(type) {
  const map = {
    'ai-agent': 'AI Agent',
    'zk-verifier': 'ZK Verifier',
    'multi-sig': 'Multi-sig',
    'dao': 'DAO',
  };
  return map[type] || type;
}

function truncateAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function EvaluatorCard({ evaluator }) {
  return (
    <Link href={`/evaluator/${evaluator.address}`} style={{ textDecoration: 'none' }}>
      <div className="card card-clickable evaluator-card">
        <div className="evaluator-card-header">
          <div>
            <div className="evaluator-card-name">{evaluator.name}</div>
            <div className="evaluator-card-address">{truncateAddress(evaluator.address)}</div>
          </div>
          <span className={`badge ${getBadgeClass(evaluator.type)}`}>
            {getTypeLabel(evaluator.type)}
          </span>
        </div>

        <div className="evaluator-card-domain">{evaluator.domain}</div>

        <div className="evaluator-card-stats">
          <div>
            <div className="evaluator-card-stat-value">{evaluator.completionRate}%</div>
            <div className="evaluator-card-stat-label">Success</div>
          </div>
          <div>
            <div className="evaluator-card-stat-value">{evaluator.totalJobs.toLocaleString()}</div>
            <div className="evaluator-card-stat-label">Jobs</div>
          </div>
          <div>
            <div className="evaluator-card-stat-value">{evaluator.avgResponseTime}</div>
            <div className="evaluator-card-stat-label">Avg Time</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export { getBadgeClass, getTypeLabel, truncateAddress };
