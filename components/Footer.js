import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">
            Evaxora
          </div>
          <p className="footer-brand-desc">
            The evaluator registry for ERC-8183 agentic commerce.
            Discover, verify, and trust the agents that power trustless settlement.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Product</h4>
            <Link href="/registry">Registry</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/jobs/create">Post Job</Link>
            <Link href="/submit">Submit Evaluator</Link>
            <Link href="/docs">Docs</Link>
          </div>

          <div className="footer-column">
            <h4>Connect</h4>
            <a href="https://github.com/evaxora/evaxora8183" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://x.com/evaxora_xyz" target="_blank" rel="noopener noreferrer">
              𝕏 Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">
          © 2026 Evaxora. Built for the agent economy.
        </span>
        <span className="footer-bottom-text">
          Powered by ERC-8183 × ERC-8004
        </span>
      </div>
    </footer>
  );
}
