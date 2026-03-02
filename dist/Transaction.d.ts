/** Represents a single transaction in the blockchain
 * Includes validation logic for balances
 */
export declare class Transaction {
    readonly sender: string;
    readonly receiver: string;
    readonly amount: number;
    readonly timestamp: number;
    constructor(sender: string, receiver: string, amount: number);
    isValid(balance: number): {
        valid: boolean;
        reason?: string;
    };
    toString(): string;
    serialize(): string;
    static createCoinbase(miner: string, reward: number): Transaction;
}
//# sourceMappingURL=Transaction.d.ts.map