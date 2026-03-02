import { Blockchain } from './Blockchain';
import { Block } from './Block';
import { Transaction } from './Transaction';
import { Miner, runMiningRace } from './Miner';
import { Node, createForkScenario } from './Node';

/**
 * Main entry point for blockchain demo
 * Runs all required demonstrations:
 * 1. Basic mining with adjustable difficulty
 * 2. Multi-miner competition with rewards
 * 3. Tamper detection
 * 4. Fork resolution
 * Plus bonus features
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';

function printHeader(title: string): void {
  console.log(`\n${BOLD}${CYAN}===== ${title} =====${RESET}\n`);
}

function printSeparator(): void {
  console.log(`\n${'-'.repeat(60)}\n`);
}

// DEMO 1: Basic Mining
function demo1BasicMining(): void {
  printHeader('DEMO 1: Mining Blocks with Adjustable Difficulty');
  
  const difficulties = [1, 2, 3];
  
  for (const diff of difficulties) {
    console.log(`\n--- Mining at Difficulty ${diff} ---`);
    const blockchain = new Blockchain(diff, 50);
    
    for (let i = 0; i < 3; i++) {
      blockchain.mineBlock(`Miner-${i + 1}`);
    }
    
    console.log(`Chain valid: ${blockchain.isChainValid().valid}`);
  }
}

// DEMO 2: Multi-Miner Competition
function demo2MultiMinerRace(): void {
  printHeader('DEMO 2: Multi-Miner Rewards & Balance Tracking');
  
  const blockchain = new Blockchain(2, 50);
  const miners = [
    new Miner('Miner A', 0, 2), // even nonce
    new Miner('Miner B', 1, 2) // odd nonce
  ];
  
  console.log('Initial balances: ' + blockchain.getBalanceString());
  
  for (let blockNum = 1; blockNum <= 4; blockNum++) {
    const previousHash = blockchain.getLatestBlock().hash;
    const blockData = {
      miner: 'TBD',
      transactions: blockchain.pendingTransactions
    };
    
    // Run the race
    const { winner, result } = runMiningRace(
      miners,
      blockNum,
      blockData,
      previousHash,
      blockchain.difficulty
    );
    
    // Create and add the winning block
    const winningBlock = new Block(
      blockNum,
      { ...blockData, miner: winner.name },
      previousHash,
      result.nonce
    );
    winningBlock.timestamp = Date.now();
    winningBlock.hash = result.hash;
    
    blockchain.addBlock(winningBlock);
    
    console.log(`Winner: ${winner.name} | Coinbase reward: ${blockchain.miningReward}`);
    console.log(`Balances: ${blockchain.getBalanceString()}`);
    
    if (blockNum === 2) {
      console.log('\n Miner A sends 20 to User B...');
      const tx = new Transaction('Miner A', 'User B', 20);
      blockchain.addTransaction(tx);
    }
    
    if (blockNum === 3) {
      console.log('\n Miner B sends 30 to User C...');
      const tx = new Transaction('Miner B', 'User C', 30);
      blockchain.addTransaction(tx);
    }
  }
  
  console.log('\nFinal Balances: ' + blockchain.getBalanceString());
  blockchain.printChain();
}

// DEMO 3: Tamper Detection
function demo3TamperDetection(): void {
  printHeader('DEMO 3: Tamper Detection');
  
  const blockchain = new Blockchain(2, 50);
  
  console.log('Building chain of 4 blocks...');
  for (let i = 0; i < 4; i++) {
    blockchain.mineBlock('Miner-1');
  }
  
  // Validate before tampering
  let validation = blockchain.isChainValid();
  console.log(`\nBefore tampering - Chain valid: ${GREEN}${validation.valid}${RESET}`);
  
  console.log(`\n${RED}!!! TAMPERING WITH BLOCK #2 !!!${RESET}`);
  blockchain.tamperWithBlock(2, {
    miner: 'Hacker',
    transactions: [Transaction.createCoinbase('Hacker', 1000)]
  });
  
  validation = blockchain.isChainValid();
  console.log(`\nAfter tampering - Chain valid: ${RED}${validation.valid}${RESET}`);
  if (!validation.valid) {
    console.log(`Failed at Block #${validation.failedBlockIndex}`);
    console.log(`Reason: ${validation.reason}`);
  }
}

// DEMO 4: Fork Resolution
function demo4ForkResolution(): void {
  printHeader('DEMO 4: Fork Resolution (Longest Chain Rule)');
  
  const genesisChain = new Blockchain(2, 50);
  
  const nodeA = new Node('Node A', genesisChain.clone());
  const nodeB = new Node('Node B', genesisChain.clone());
  
  console.log('Both nodes start with genesis block only');
  
  const prevHash = genesisChain.getLatestBlock().hash;
  
  const block1A = new Block(
    1,
    { miner: 'Miner A', transactions: [Transaction.createCoinbase('Miner A', 50)] },
    prevHash
  );
  block1A.mineBlock(2);
  
  const block1B = new Block(
    1,
    { miner: 'Miner B', transactions: [Transaction.createCoinbase('Miner B', 50)] },
    prevHash
  );
  block1B.mineBlock(2);
  
  createForkScenario(nodeA, nodeB, block1A, block1B);
  
  // Node A mines another block, making its chain longer
  console.log(`\nNode A mines next block on top of its chain...`);
  const block2A = new Block(
    2,
    { miner: 'Miner A', transactions: [Transaction.createCoinbase('Miner A', 50)] },
    block1A.hash
  );
  block2A.mineBlock(2);
  nodeA.blockchain.addBlock(block2A);
  
  console.log(`Node A chain length: ${nodeA.blockchain.chain.length}`);
  console.log(`Node B chain length: ${nodeB.blockchain.chain.length}`);
  
  console.log(`\n${BOLD}Resolving fork...${RESET}`);
  nodeB.syncWith(nodeA);
  
  console.log('\n��� Final State After Resolution:');
  nodeA.printState();
  nodeB.printState();
  
  const aTip = nodeA.blockchain.getLatestBlock().hash;
  const bTip = nodeB.blockchain.getLatestBlock().hash;
  console.log(`\n${aTip === bTip ? GREEN + '✓' : RED + '✗'} ${RESET} ` +
              `Nodes ${aTip === bTip ? 'AGREE' : 'DISAGREE'} on chain tip`);
}

// BONUS: Difficulty Comparison
function bonusDifficultyComparison(): void {
  printHeader('BONUS: Difficulty Comparison Table');
  
  console.log('Mining 3 blocks at each difficulty level...\n');
  
  const results: { [diff: number]: number[] } = {};
  
  for (let diff = 1; diff <= 4; diff++) {
    results[diff] = [];
    console.log(`Testing difficulty ${diff}...`);
    
    for (let trial = 0; trial < 3; trial++) {
      const blockchain = new Blockchain(diff, 50);
      const start = Date.now();
      blockchain.mineBlock('Tester');
      const elapsed = Date.now() - start;
      results[diff].push(elapsed);
    }
  }
  
  console.log(`\n${BOLD}Results:${RESET}`);
  console.log('Difficulty | Trial 1 (ms) | Trial 2 (ms) | Trial 3 (ms) | Average (ms)');
  console.log('---------- | ------------ | ------------ | ------------ | ------------');
  
  for (let diff = 1; diff <= 4; diff++) {
    const times = results[diff];
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const row = `${diff.toString().padStart(10)} | ` +
                `${times[0].toString().padStart(12)} | ` +
                `${times[1].toString().padStart(12)} | ` +
                `${times[2].toString().padStart(12)} | ` +
                `${avg.toString().padStart(12)}`;
    console.log(row);
  }
  
  console.log(`\n${CYAN}Observation: Higher difficulty = exponentially longer mining time${RESET}`);
}

// BONUS: Transaction Ledger
function bonusTransactionLedger(): void {
  printHeader('BONUS: Complete Transaction Ledger');
  
  const blockchain = new Blockchain(2, 50);
  
  blockchain.mineBlock('Genesis-Miner');
  
  blockchain.addTransaction(new Transaction('Genesis-Miner', 'Alice', 10));
  blockchain.addTransaction(new Transaction('Genesis-Miner', 'Bob', 5));
  blockchain.mineBlock('Miner-1');
  
  blockchain.addTransaction(new Transaction('Alice', 'Charlie', 3));
  blockchain.addTransaction(new Transaction('Bob', 'Alice', 2));
  blockchain.mineBlock('Miner-2');
  
  console.log('Complete Transaction History:\n');
  
  for (const block of blockchain.chain) {
    console.log(`Block #${block.index} (${block.data.miner}):`);
    for (const tx of block.data.transactions) {
      console.log(`  → ${tx.toString()}`);
    }
    console.log('');
  }
  
  console.log(`Final Balances: ${blockchain.getBalanceString()}`);
}

function main(): void {
  console.log(`${BOLD}${CYAN}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           BLOCKCHAIN FINALE - COMPLETE DEMO                ║');
  console.log('║     TypeScript + Node.js End-to-End Implementation         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`${RESET}`);
  
  try {
    demo1BasicMining();
    printSeparator();
    
    demo2MultiMinerRace();
    printSeparator();
    
    demo3TamperDetection();
    printSeparator();
    
    demo4ForkResolution();
    printSeparator();
    
    bonusDifficultyComparison();
    printSeparator();
    
    bonusTransactionLedger();
    
    console.log(`\n${GREEN}${BOLD}✓ All demos completed successfully!${RESET}\n`);
    
  } catch (error) {
    console.error(`\n${RED}Error running demos:${RESET}`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main };
