'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Header() {
  const { isConnected } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-left">
        <Link href="/" className="header-logo">
          <img src="/logo.png" alt="Evaxora" className="header-logo-icon" />
          <span className="header-logo-name">Evaxora</span>
          <span className="header-logo-tag">ERC-8183</span>
        </Link>
        <nav className="header-nav">
          <Link href="/registry" className="header-nav-link">Registry</Link>
          <Link href="/jobs" className="header-nav-link">Jobs</Link>
          <Link href="/jobs/create" className="header-nav-link">Post Job</Link>
          <Link href="/docs" className="header-nav-link">Docs</Link>
          {isConnected && <Link href="/dashboard" className="header-nav-link">Dashboard</Link>}
        </nav>
      </div>
      <div className="header-right">
        <div className="header-network">
          <div className="header-network-dot" />
          <span className="header-network-name">Base</span>
        </div>
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
            const connected = mounted && account && chain;
            return (
              <button
                className="btn-wallet"
                onClick={connected ? openAccountModal : openConnectModal}
              >
                {connected
                  ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
                  : 'Connect wallet'}
              </button>
            );
          }}
        </ConnectButton.Custom>

        {/* Hamburger button — mobile only */}
        <button
          className="header-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={closeMenu} />}

      {/* Mobile slide-out menu */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <Link href="/registry" className="mobile-nav-link" onClick={closeMenu}>Registry</Link>
        <Link href="/jobs" className="mobile-nav-link" onClick={closeMenu}>Jobs</Link>
        <Link href="/jobs/create" className="mobile-nav-link" onClick={closeMenu}>Post Job</Link>
        <Link href="/docs" className="mobile-nav-link" onClick={closeMenu}>Docs</Link>
        {isConnected && <Link href="/dashboard" className="mobile-nav-link" onClick={closeMenu}>Dashboard</Link>}
        <div className="mobile-nav-footer">
          <div className="mobile-nav-badge">
            <span style={{ color: 'var(--success)', fontSize: '8px' }}>●</span>
            Base
          </div>
        </div>
      </nav>
    </header>
  );
}
