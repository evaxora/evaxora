# Evaxora — Agent Context

## Overview
Evaxora is an evaluator registry for ERC-8183 (Agentic Commerce Protocol) on Base Sepolia. Two smart contracts power the platform:
- **EvaxoraRegistry** — evaluator registration, verification, querying
- **AgenticCommerce** — ERC-8183 job creation, funding, evaluation

## Contract Addresses (Base Sepolia)
- Registry: `0x7Ee0f29DBBc1b9826eaD2461C6f52a3BB66dEB36`
- ACP (Jobs): `0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B`
- ABIs and constants live in `lib/contract.js`

## Key Architecture Decisions
- **No backend / API** — all data comes from on-chain reads via Wagmi `useReadContract`
- **Vanilla CSS** — all styles in `app/globals.css` using CSS custom properties (design tokens)
- **Next.js App Router** — all pages in `app/` dir, `'use client'` directive on interactive pages
- **RainbowKit + Wagmi** — wallet connection via `components/Web3Providers.js`

## File Map
```
app/page.js              — Landing page (hero, evaluator table, flow, CTA)
app/registry/page.js     — Full evaluator registry with search/filter
app/evaluator/[addr]/    — Evaluator profile
app/jobs/page.js         — Job listing (on-chain)
app/jobs/create/page.js  — Create job form
app/submit/page.js       — Register evaluator form
app/dashboard/page.js    — User dashboard
app/docs/page.js         — Documentation page
app/globals.css          — ALL styles (design tokens + components)
components/              — Header, Footer, Ticker, Toast, EvaluatorCard, Web3Providers
lib/contract.js          — ABIs, addresses, EVAL_TYPES, JOB_STATUSES
contracts/               — Solidity source (EvaxoraRegistry, AgenticCommerce, MockUSDC)
scripts/                 — Hardhat deploy & seed scripts
```

## Styling Conventions
- Use existing CSS classes from `globals.css` — don't add Tailwind or CSS modules
- Design tokens defined in `:root {}` (colors, spacing, radii, transitions)
- Naming: `.section-name` for sections, `.component-part` for sub-elements
- Font: Inter (sans), SF Mono/Fira Code (mono)
- Theme: Dark mode only, black backgrounds with subtle borders

## Evaluator Data Shape
```js
{
  addr: '0x...',
  name: 'Vireon',
  evalType: 0,        // 0=AI Agent, 1=ZK Verifier, 2=Multi-sig, 3=DAO
  domain: 'Security',
  description: '...',
  registeredAt: 123n,  // uint256 (unix timestamp)
  verified: true,
  active: true,
}
```

## Job Data Shape
```js
{
  id: 1n,
  client: '0x...',
  provider: '0x...',
  evaluator: '0x...',
  description: '...',
  budget: 0n,
  expiredAt: 123n,
  status: 0,           // 0=Open, 1=Funded, 2=Submitted, 3=Completed, 4=Rejected, 5=Expired
  paymentToken: '0x...'
}
```

## Common Gotchas
- BigInt values from contracts — always convert with `Number()` or `BigInt()` before math
- Contract reads return `undefined` while loading — always default: `evaluators || []`
- Wallet connection required for write operations — check `isConnected` before `writeContract`
- `npm run dev` runs on port 3000 by default
