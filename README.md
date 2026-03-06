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
   -  Blocks contain index (position), timestamp (Date.now()), data (BlockData: miner string + Transaction[]), previousHash (prior block hash), nonce (PoW solution), hash (SHA256 of all fields concatenated).
   -  Purpose: previousHash chains blocks immutably; nonce+hash prove computational work (prefix zeros = difficulty); data stores payload; index/timestamp ensure ordering.

2. Exactly what isChainValid() checks
   - Iterates blocks 1-N checking three conditions per block:
        Hash integrity: block.hash === block.calculateHash() (recomputes SHA256 from fields)
        Chain linking: currentBlock.previousHash === previousBlock.hash
        Proof-of-work: block.hash.startsWith('0'.repeat(difficulty)) via hasValidHash()
     Returns {valid: false, failedBlockIndex: i, reason: "..."} on first failure; genesis (index 0) assumed valid.

3. How you simulated a multi-miner race (nonce ranges / stepping)
   - Miner class assigns each miner unique nonceStart/nonceStep (e.g., Miner A: start=0 step=1; Miner B: start=1000 step=2).
   - runMiningRace() pits miners vs each other in batches: each attemptMine() tests nonces in parallel-like rounds (nonceStart + i*nonceStep) until one hits target prefix, simulating hash power competition via disjoint search spaces.
   - Demo2 alternates winners narratively; real race uses first-to-solve-wins logic.

4. What your fork scenario is and how you resolved it
   - Fork: Two valid competing blocks (#1A vs #1B) at same height sharing same previousHash (genesis)—one accepted per node via addBlock() in createForkScenario().
   - Resolution: Node.syncWith() + replaceChain() implements longest-chain rule:
        - Compare chain lengths
        - Fully validate rival chain via isChainValid()
        - If rival longer AND valid, clone/adopt entire chain (shorter fork orphaned) Demo4: Node A mines Block #2 atop #1A; Node B switches from #1B→#1A→#2.
​

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
