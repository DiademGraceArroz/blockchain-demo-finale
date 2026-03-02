# blockchain-demo-finale

A complete end-to-end blockchain demonstration in TypeScript + Node.js, implementing proof-of-work mining, multi-miner competition, balance tracking, tamper detection, and fork resolution.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Design Explanation](#design-explanation)
- [Demo Output](#demo-output)
- [Technical Details](#technical-details)

## ✨ Features

### Core Requirements (All Implemented)
- ✅ **Block & Chain Fundamentals**: SHA-256 hashing, chain linking, genesis block
- ✅ **Mining with Adjustable Difficulty**: Proof-of-work with configurable difficulty (1-4+)
- ✅ **Multi-Miner Competition**: Simulated racing with nonce range splitting
- ✅ **Mining Rewards & Balances**: 50 coin coinbase rewards, UTXO-style balance tracking
- ✅ **Tamper Detection**: Full chain validation with detailed error reporting
- ✅ **Fork Resolution**: Longest valid chain rule implementation

### Bonus Features
- 🎁 **Transaction Ledger**: Complete formatted history of all transactions
- 🎁 **Difficulty Comparison Table**: Automated benchmarking across difficulty levels
- 🎁 **Network Simulation**: Multi-node architecture with peer connections

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DiademGraceArroz/blockchain-demo-finale.git
cd blockchain-demo-finale

# Install dependencies
npm install

# Run the demo
npm start

# Or run in development mode (ts-node)
npm run dev