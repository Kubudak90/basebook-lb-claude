# BaseBook - Liquidity Book DEX

A decentralized exchange (DEX) built on Base blockchain using TraderJoe V2's Liquidity Book technology. BaseBook provides advanced liquidity management with concentrated liquidity bins, enabling efficient trading and flexible liquidity provision strategies.

## Features

- **Liquidity Book Technology**: Advanced AMM model using discrete price bins for concentrated liquidity
- **Multi-Token Support**: Trade WETH, USDC, and EURC on Base Sepolia testnet
- **Flexible Liquidity Provision**: Add/remove liquidity with customizable distribution strategies
- **Smart Wallet Integration**: Seamless Coinbase Smart Wallet support
- **Multi-Chain Support**: Base mainnet and Base Sepolia testnet

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Web3**: Wagmi v2, Viem, WalletConnect
- **Smart Contracts**: Solidity 0.8.10 (TraderJoe V2 fork)
- **Build Tools**: Forge (Foundry) for smart contracts

## Smart Contracts (Base Sepolia)

Deployed on December 20, 2024:

| Contract | Address |
|----------|---------|
| LBFactory | `0x1aF4454bdcE78b2D130b4CD8fcd867195b7a2D1B` |
| LBRouter | `0xFF9a6f598CaD576E45c44d2238CFF785CE089433` |
| LBQuoter | `0xDE43cABB9F8a2e4B79059f72748EcacF8Eef0df5` |
| LBPairImplementation | `0x7B3d501f0FA7c63e65c4aABEaa9a967841CC1b5E` |

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia ETH for testing (get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/[your-username]/basebook-lb.git
cd basebook-lb
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and configure:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# WalletConnect Project ID (optional but recommended)
# Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Base Sepolia RPC (optional, defaults to public RPC)
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
basebook-lb/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── liquidity/         # Liquidity management components
│   ├── swap/              # Swap interface components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── web3/              # Web3 configuration (wagmi, viem)
│   ├── contracts/         # Contract ABIs and addresses
│   └── utils/             # Helper functions
├── joe-v2/                # TraderJoe V2 smart contracts (Solidity)
│   ├── src/               # Contract source code
│   └── test/              # Contract tests
└── public/                # Static assets
```

## Key Features Explained

### Liquidity Book Bins

Unlike traditional AMMs (like Uniswap V2) that use a single price curve, Liquidity Book uses discrete price bins:

- Each bin represents a specific price point
- Liquidity providers can choose which bins to provide liquidity to
- More capital efficient than traditional AMMs
- Bins below the active price contain only tokenY (quote asset)
- Bins above the active price contain only tokenX (base asset)

### Distribution Strategies

When adding liquidity, you can customize your distribution:

- **Spot**: Concentrate liquidity at current price
- **Curve**: Normal distribution around current price
- **Bid-Ask**: Spread liquidity evenly across a range

### Precision Requirements

The smart contracts use 1e18 (10^18) precision for distribution calculations. The frontend implements BigInt arithmetic to avoid JavaScript Number precision loss when handling these large values.

## Recent Bug Fixes

This codebase includes several critical fixes for liquidity addition:

1. **PRECISION constant** (commit 75192e8): Fixed mismatch between frontend (10000) and contracts (1e18)
2. **BigInt precision** (commit a250e37): Implemented string-based BigInt math to avoid Number.MAX_SAFE_INTEGER overflow
3. **Double swap bug** (commit 0a0cbbb): Removed duplicate token amount swapping that caused transaction reverts

## Smart Contract Development

The smart contracts are in the `joe-v2/` directory and use Foundry:

```bash
cd joe-v2

# Install Foundry dependencies
forge install

# Run tests
forge test

# Deploy contracts (requires configuration)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | No | WalletConnect project ID for wallet connectivity |
| `NEXT_PUBLIC_BASE_SEPOLIA_RPC` | No | Custom RPC URL for Base Sepolia (defaults to public RPC) |

## Learn More

- [TraderJoe V2 Documentation](https://docs.traderjoexyz.com/guides/liquidity-book)
- [Base Chain Documentation](https://docs.base.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)

## Support

For issues and questions, please [open an issue](https://github.com/[your-username]/basebook-lb/issues) on GitHub.

## License

MIT

---

**Note**: This is a fork of TraderJoe V2 adapted for Base blockchain. Smart contracts maintain compatibility with the original TraderJoe V2 architecture.
