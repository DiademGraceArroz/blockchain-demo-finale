/** Core types and interfaces for the blockchain system */
export interface TransactionData {
    sender: string;
    receiver: string;
    amount: number;
    timestamp: number;
}
export interface BlockData {
    transactions: TransactionData[];
    miner: string;
}
export interface MiningResult {
    success: boolean;
    nonce: number;
    hash: string;
    miningTime: number;
    miner: string;
    timestamp: number;
}
export interface ValidationResult {
    valid: boolean;
    failedBlockIndex?: number;
    reason?: string;
}
export interface BalanceMap {
    [address: string]: number;
}
//# sourceMappingURL=types.d.ts.map