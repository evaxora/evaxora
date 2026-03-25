# Contributing to Evaxora

Thanks for your interest in contributing to Evaxora! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MetaMask or compatible wallet
- Base Sepolia testnet ETH ([faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Setup

```bash
# Clone the repo
git clone https://github.com/evaxora/evaxora8183.git
cd evaxora

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Smart Contract Development

```bash
# Create a .env file with your private key
echo "PRIVATE_KEY=your_private_key_here" > .env

# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.cjs --network baseSepolia
```

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js pages (App Router) |
| `components/` | Reusable React components |
| `contracts/` | Solidity smart contracts |
| `scripts/` | Hardhat deploy & seed scripts |
| `lib/` | ABIs, addresses, constants |

## How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "feat: add your feature"`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, no logic change)
- `refactor:` — Code refactoring
- `chore:` — Build, tooling, or dependency changes

## Code Style

- **CSS**: Use existing design tokens from `globals.css`. No Tailwind or CSS modules.
- **Components**: Keep components focused and reusable. Use `'use client'` directive for interactive pages.
- **Contracts**: Follow Solidity style guide. Use OpenZeppelin where possible.

## Questions?

Open an [issue](https://github.com/evaxora/evaxora8183/issues) or start a [discussion](https://github.com/evaxora/evaxora8183/discussions).
