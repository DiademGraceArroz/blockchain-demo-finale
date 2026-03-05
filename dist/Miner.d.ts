import { MiningResult, BlockData } from './types';
/**
 * Represents a miner competing to find the next block
 * Each miner searches a different nonce range to simulate competition
 */
export declare class Miner {
    name: string;
    nonceStep: number;
    nonceStart: number;
    color: string;
    constructor(name: string, nonceStart?: number, nonceStep?: number);
    private getColorForMiner;
    /**
     * Attempts to mine a block
     * Searches nonces: start, start+step, start+2*step, ...
     * Uses Block.calculateHash() for consistent hash computation
     */
    attemptMine(index: number, data: BlockData, previousHash: string, difficulty: number, maxIterations?: number): MiningResult;
}
/**
 * Simulates a mining race between multiple miners
 * Returns the winner and the winning block
 */
export declare function runMiningRace(miners: Miner[], index: number, data: BlockData, previousHash: string, difficulty: number): {
    winner: Miner;
    result: MiningResult;
};
//# sourceMappingURL=Miner.d.ts.map