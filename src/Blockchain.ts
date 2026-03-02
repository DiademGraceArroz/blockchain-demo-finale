import { Block } from './Block';
import { Transaction } from './Transaction';
import { BalanceMap, ValidationResult } from './types';

// Blockchain class representing the blockchain
export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public miningReward: number;
  public pendingTransactions: Transaction[];

  constructor(difficulty: number = 2, miningReward: number = 50) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.miningReward = miningReward;
    this.pendingTransactions = [];
  }

  // Creates the first block in the chain
  private createGenesisBlock(): Block {
    const genesisData = {
      miner: 'Genesis',
      transactions: [Transaction.createCoinbase('Genesis', 0)]
    };
    const block = new Block(0, genesisData, '0'.repeat(64));
    const originalDifficulty = this.difficulty;
    this.difficulty = 1;
    block.mineBlock(1);
    this.difficulty = originalDifficulty;
    return block;
  }

  // Returns the latest block in the chain
  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Adds a new transaction to the pending transactions
  public addTransaction(transaction: Transaction): boolean {
    if (transaction.sender !== 'COINBASE') {
      const balances = this.getBalances();
      const validation = transaction.isValid(balances[transaction.sender] || 0);
      
      if (!validation.valid) {
        console.log(`Transaction rejected: ${validation.reason}`);
        return false;
      }
    }
    
    this.pendingTransactions.push(transaction);
    return true;
  }


  // Mines pending transactions into a new block
  public mineBlock(miner: string): Block {
    const coinbaseTx = Transaction.createCoinbase(miner, this.miningReward);
    
    const blockData = {
      miner: miner,
      transactions: [coinbaseTx, ...this.pendingTransactions]
    };

    const newBlock = new Block(
      this.chain.length,
      blockData,
      this.getLatestBlock().hash
    );

    const miningTime = newBlock.mineBlock(this.difficulty);
    
    console.log(
      `Block #${newBlock.index} mined in ${miningTime}ms | ` +
      `Nonce: ${newBlock.nonce} | Hash: ${newBlock.hash.substring(0, 10)}...`
    );

    this.chain.push(newBlock);
    this.pendingTransactions = [];
    
    return newBlock;
  }

  // Directly adds a block to the chain (used in fork scenarios)
  public addBlock(block: Block): boolean {
    // Validate block links to the latest block
    if (block.previousHash !== this.getLatestBlock().hash) {
      console.log(`Block ${block.index} rejected: previous hash mismatch`);
      return false;
    }
    
    // Validate block hash
    if (!block.hasValidHash(this.difficulty)) {
      console.log(`Block ${block.index} rejected: invalid hash`);
      return false;
    }
    
    this.chain.push(block);
    return true;
  }

  // Calculates all balances from the blockchain history
  public getBalances(): BalanceMap {
    const balances: BalanceMap = {};

    for (const block of this.chain) {
      for (const tx of block.data.transactions) {
        if (!balances[tx.sender] && tx.sender !== 'COINBASE') {
          balances[tx.sender] = 0;
        }
        if (!balances[tx.receiver]) {
          balances[tx.receiver] = 0;
        }

        if (tx.sender !== 'COINBASE') {
          balances[tx.sender] -= tx.amount;
        }
        
        balances[tx.receiver] += tx.amount;
      }
    }

    return balances;
  }

  public getBalanceString(): string {
    const balances = this.getBalances();
    const entries = Object.entries(balances)
      .filter(([addr]) => addr !== 'Genesis' && addr !== 'COINBASE')
      .map(([addr, bal]) => `${addr}: ${bal}`)
      .join(' | ');
    return entries;
  }

/**
 * Validates the entire chain
 * Checks:
 * 1. Hash integrity
 * 2. Chain linking
 * 3. Proof of work
 */
  public isChainValid(): ValidationResult {
    if (this.chain.length === 0) {
      return { valid: false, reason: 'Empty chain' };
    }

    // Validate each block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check 1. Hash integrity
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return {
          valid: false,
          failedBlockIndex: i,
          reason: `Block #${i} hash mismatch: stored=${currentBlock.hash.substring(0, 15)}..., calculated=${currentBlock.calculateHash().substring(0, 15)}...`
        };
      }

      // Check 2. Chain linking
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          failedBlockIndex: i,
          reason: `Block #${i} link broken: previousHash=${currentBlock.previousHash.substring(0, 15)}..., expected=${previousBlock.hash.substring(0, 15)}...`
        };
      }

      // Check 3. Proof of work
      if (!currentBlock.hasValidHash(this.difficulty)) {
        return {
          valid: false,
          failedBlockIndex: i,
          reason: `Block #${i} hash does not meet difficulty ${this.difficulty}: ${currentBlock.hash.substring(0, 10)}...`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Simulates tampering by modifying block data without re-mining
   * Used for demonstrating tamper detection
   */
  public tamperWithBlock(index: number, newData: any): void {
    if (index < 0 || index >= this.chain.length) {
      console.log(`Invalid block index: ${index}`);
      return;
    }
    
    const block = this.chain[index];
    console.log(`Tampering with Block #${index}...`);
    console.log(`Original data: ${JSON.stringify(block.data)}`);
    
    block.data = newData;
    
    console.log(`Modified data: ${JSON.stringify(block.data)}`);
    console.log(`Hash remains: ${block.hash.substring(0, 15)}... (now invalid)`);
  }

  // Prints the entire chain
  public printChain(): void {
    console.log('\n--- Blockchain State ---');
    this.chain.forEach(block => {
      console.log(block.toString());
    });
    console.log('------------------------\n');
  }

// Calculates the total amount of work required to mine the entire chain
  public getCumulativeWork(): number {
    return this.chain.length * this.difficulty;
  }

  /**
   * Replaces chain with longer valid chain
   * Implements the longest chain rule
   */
  public replaceChain(newChain: Block[]): boolean {
    if (newChain.length <= this.chain.length) {
      console.log(`Rejected: new chain (${newChain.length}) not longer than current (${this.chain.length})`);
      return false;
    }

    // Validate new chain
    const tempChain = new Blockchain(this.difficulty, this.miningReward);
    tempChain.chain = newChain;
    
    const validation = tempChain.isChainValid();
    if (!validation.valid) {
      console.log(`Rejected: new chain is invalid - ${validation.reason}`);
      return false;
    }

    // Replace current chain
    console.log(`Adopting new chain: ${this.chain.length} → ${newChain.length} blocks`);
    this.chain = newChain.map(b => b.clone());
    return true;
  }

  // Creates a copy of the blockchain
  public clone(): Blockchain {
    const newChain = new Blockchain(this.difficulty, this.miningReward);
    newChain.chain = this.chain.map(b => b.clone());
    newChain.pendingTransactions = this.pendingTransactions.map(tx => 
      new Transaction(tx.sender, tx.receiver, tx.amount)
    );
    return newChain;
  }
}
