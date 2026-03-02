import { Block } from './Block';
import { Transaction } from './Transaction';
import { MiningResult } from './types';

/**
 * Represents a miner competing to find the next block
 * Each miner searches a different nonce range to simulate competition
 */
export class Miner {
  public name: string;
  public nonceStep: number;
  public nonceStart: number;
  public color: string;

  constructor(name: string, nonceStart: number = 0, nonceStep: number = 1) {
    this.name = name;
    this.nonceStart = nonceStart;
    this.nonceStep = nonceStep;
    this.color = this.getColorForMiner(name);
  }

  private getColorForMiner(name: string): string {
    const colors: { [key: string]: string } = {
      'Miner A': '\x1b[32m', // Green
      'Miner B': '\x1b[34m', // Blue
      'Miner C': '\x1b[33m', // Yellow
      'default': '\x1b[0m'
    };
    return colors[name] || colors['default'];
  }

  /**
   * Attempts to mine a block
   * Searches nonces: start, start+step, start+2*step, ...
   * Returns when valid hash found or max iterations reached
   */
  public attemptMine(
    index: number,
    data: any,
    previousHash: string,
    difficulty: number,
    maxIterations: number = 1000000
  ): MiningResult {
    const target = '0'.repeat(difficulty);
    let nonce = this.nonceStart;
    const startTime = Date.now();

    for (let i = 0; i < maxIterations; i++) {
      // Create block with current nonce
      const timestamp = Date.now();
      const blockData = JSON.stringify(data);
      const blockString = index + timestamp + blockData + previousHash + nonce;
      
      const { createHash } = require('crypto');
      const hash = createHash('sha256').update(blockString).digest('hex');

      // Check if hash is valid
      if (hash.substring(0, difficulty) === target) {
        const endTime = Date.now();
        
        // Create the actual block
        const block = new Block(index, data, previousHash, nonce);
        block.timestamp = timestamp;
        block.hash = hash;

        return {
          success: true,
          nonce,
          hash,
          miningTime: endTime - startTime,
          miner: this.name
        };
      }

      nonce += this.nonceStep;
    }

    return {
      success: false,
      nonce: -1,
      hash: '',
      miningTime: Date.now() - startTime,
      miner: this.name
    };
  }
}

/**
 * Simulates a mining race between multiple miners
 * Returns the winner and the winning block
 */
export function runMiningRace(
  miners: Miner[],
  index: number,
  data: any,
  previousHash: string,
  difficulty: number
): { winner: Miner; result: MiningResult } {
  console.log(`\nMining Race for Block #${index} (difficulty: ${difficulty})`);
  console.log(`Competitors: ${miners.map(m => m.name).join(' vs ')}`);
  
  let batchSize = 1000;
  let iterations = 0;
  const maxTotalIterations = 10000000; // Safety limit

  while (iterations < maxTotalIterations) {
    for (const miner of miners) {
      const result = miner.attemptMine(
        index,
        data,
        previousHash,
        difficulty,
        batchSize
      );

      if (result.success) {
        console.log(`${miner.color}${miner.name} WINS!${'\x1b[0m'}`);
        console.log(`   Nonce: ${result.nonce} | Hash: ${result.hash.substring(0, 15)}...`);
        console.log(`   Time: ${result.miningTime}ms | Iterations: ${iterations + batchSize}`);
        return { winner: miner, result };
      }
    }
    
    iterations += batchSize;
    batchSize = Math.min(batchSize * 2, 50000);
  }

  throw new Error('Mining race exceeded maximum iterations');
}
