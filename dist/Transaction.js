"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
/** Represents a single transaction in the blockchain
 * Includes validation logic for balances
 */
class Transaction {
    constructor(sender, receiver, amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = Date.now();
    }
    // Validate if the sender has sufficient balance for this transaction
    isValid(balance) {
        if (this.sender === 'COINBASE') {
            return { valid: true };
        }
        if (this.amount <= 0) {
            return { valid: false, reason: 'Amount must be positive' };
        }
        if (balance < this.amount) {
            return {
                valid: false,
                reason: `Insufficient balance: ${balance} < ${this.amount}`
            };
        }
        return { valid: true };
    }
    // Formats transaction for display
    toString() {
        if (this.sender === 'COINBASE') {
            return `[COINBASE] → ${this.receiver}: ${this.amount} coins`;
        }
        return `${this.sender} → ${this.receiver}: ${this.amount} coins`;
    }
    // Serializes transaction for hashing
    serialize() {
        return JSON.stringify({
            sender: this.sender,
            receiver: this.receiver,
            amount: this.amount,
            timestamp: this.timestamp
        });
    }
    // Factory method for coinbase / mining reward transactions
    static createCoinbase(miner, reward) {
        const tx = new Transaction('COINBASE', miner, reward);
        tx.timestamp = Date.now();
        return tx;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map