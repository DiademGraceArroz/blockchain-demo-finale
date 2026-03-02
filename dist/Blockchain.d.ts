import { Block } from './Block';
import { Transaction } from './Transaction';
import { BalanceMap, ValidationResult } from './types';
export declare class Blockchain {
    chain: Block[];
    difficulty: number;
    miningReward: number;
    pendingTransactions: Transaction[];
    constructor(difficulty?: number, miningReward?: number);
    private createGenesisBlock;
    getLatestBlock(): Block;
    addTransaction(transaction: Transaction): boolean;
    mineBlock(miner: string): Block;
    addBlock(block: Block): boolean;
    getBalances(): BalanceMap;
    getBalanceString(): string;
    /**
     * Validates the entire chain
     * Checks:
     * 1. Hash integrity
     * 2. Chain linking
     * 3. Proof of work
     */
    isChainValid(): ValidationResult;
    /**
     * Simulates tampering by modifying block data without re-mining
     * Used for demonstrating tamper detection
     */
    tamperWithBlock(index: number, newData: any): void;
    printChain(): void;
    getCumulativeWork(): number;
    /**
     * Replaces chain with longer valid chain
     * Implements the longest chain rule
     */
    replaceChain(newChain: Block[]): boolean;
    clone(): Blockchain;
}
//# sourceMappingURL=Blockchain.d.ts.map