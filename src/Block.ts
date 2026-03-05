import { createHash } from 'crypto';
import { Transaction } from './Transaction';
import { BlockData } from './types';

// Block class representing a single block in the blockchain
export class Block {
  public index: number;
  public timestamp: number;
  public data: BlockData;
  public previousHash: string;
  public nonce: number;
  public hash: string;

  constructor(
    index: number,
    data: BlockData,
    previousHash: string = '',
    nonce: number = 0,
    timestamp?: number,
    hash?: string
  ) {
    this.index = index;
    this.timestamp = timestamp ?? Date.now();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = nonce;
    // Use provided hash or calculate initial hash
    this.hash = hash ?? this.calculateHash();
  }

// Calculates SHA-256 hash of all block fields
  public calculateHash(): string {
    const dataString = JSON.stringify(this.data);
    const blockString = 
      this.index + 
      this.timestamp + 
      dataString + 
      this.previousHash + 
      this.nonce;
    
    return createHash('sha256').update(blockString).digest('hex');
  }

  // Mines the block until a valid hash is found
  public mineBlock(difficulty: number): number {
    const target = '0'.repeat(difficulty);
    const startTime = Date.now();
    
    // loop until a valid hash is found
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.timestamp = Date.now();
      this.hash = this.calculateHash();
    }
    
    const endTime = Date.now();
    return endTime - startTime;
  }

  // Checks if the hash of the block is valid
  public hasValidHash(difficulty: number): boolean {
    const recalculatedHash = this.calculateHash();
    const target = '0'.repeat(difficulty);
    
    return (
      this.hash === recalculatedHash &&
      this.hash.substring(0, difficulty) === target
    );
  }

  public toString(): string {
    const txSummary = this.data.transactions
      .map(tx => tx.toString())
      .join(', ');
    
    return `Block #${this.index} [${this.hash.substring(0, 10)}...] | ` +
           `Miner: ${this.data.miner} | Nonce: ${this.nonce} | ` +
           `Tx: [${txSummary}]`;
  }

  // Creates a copy of the block
  public clone(): Block {
    const clonedData: BlockData = {
      miner: this.data.miner,
      transactions: this.data.transactions.map(tx => 
        new Transaction(tx.sender, tx.receiver, tx.amount)
      )
    };
    
    const block = new Block(
      this.index,
      clonedData,
      this.previousHash,
      this.nonce
    );
    block.timestamp = this.timestamp;
    block.hash = this.hash;
    return block;
  }
}
