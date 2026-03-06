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

### Questions
1. What fields are included in a block and why
   -  Blockchain demo include these fields in a block object: index, timestamp, data (transactions), previousHash, nonce, and hash. Index tracks chain position; timestamp records creation; data holds payload; previousHash links to prior block for immutability; nonce solves PoW puzzle; hash is SHA256 of all fields. This structure prevents tampering—if any field changes, hash invalidates, breaking the chain
3. Exactly what isChainValid() checks
4. How you simulated a multi-miner race (nonce ranges / stepping)
5. What your fork scenario is and how you resolved it

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
