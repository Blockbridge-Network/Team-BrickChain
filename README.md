# BrickChain

## Overview
BrickChain is a decentralized application (DApp) that revolutionizes real estate investment and lending through blockchain technology. It enables fractional ownership of properties, smart contract-based lending, and token-gated access to real estate investments. The platform solves the traditional barriers to real estate investment by making it more accessible, transparent, and efficient through blockchain technology.

## Features
- ✅ Smart Contract Lending: Automated lending protocols with transparent terms and conditions
- ✅ Credit Scoring with SBT: Soulbound Tokens for immutable credit history and reputation
- ✅ Token-gated Content Access: Secure access to investment opportunities based on token holdings
- ✅ Fractional Property Ownership: Break down real estate investments into manageable tokens
- ✅ Asset Marketplace: Trade real estate tokens in a decentralized marketplace
- ✅ Investment Management: Professional tools for managing real estate portfolios

## Project Structure
- `smart-contracts/`: Smart contracts written in Solidity
  - `contracts/`: Core smart contracts
  - `interfaces/`: Contract interfaces
  - `scripts/`: Deployment and interaction scripts
  - `test/`: Contract test files
- `src/`: Frontend application
  - `app/`: Next.js application routes and pages
  - `components/`: Reusable React components
  - `contexts/`: React context providers
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and configurations
  - `types/`: TypeScript type definitions
- `public/`: Static assets
- `supabase/`: Database and authentication configuration

## Tech Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest
- **Blockchain**: Ethereum (Sonic Testnet)
- **Development Tools**: ESLint, Prettier, Babel
- **Authentication**: Supabase

## Smart Contracts
| Contract | Description |
|----------|-------------|
| `BCTToken.sol` | Native token for the platform |
| `PropertyRegistry.sol` | Property registration and management |
| `FractionalOwnership.sol` | Fractional ownership implementation |
| `AssetMarketplace.sol` | Marketplace for trading property tokens |
| `InvestmentManager.sol` | Investment portfolio management |

## How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- Access to Sonic Testnet

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/brickearn.git
cd brickearn
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install smart contract dependencies
cd smart-contracts
npm install
```

3. Set up environment variables
```bash
# Copy the example environment file
cp .env.example .env
# Fill in your environment variables
```

4. Start the development server
```bash
# From the root directory
npm run dev
```

### Smart Contract Development
```bash
cd smart-contracts
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network sonic
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please open an issue in the GitHub repository or contact the development team.

## Authors
- Prince Aikins Baidoo
- Emmanuel Tannor
- Henry Anomah
