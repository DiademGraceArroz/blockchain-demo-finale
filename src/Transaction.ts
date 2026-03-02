import { TransactionData } from './types';

/** Represents a single transaction in the blockchain
 * Includes validation logic for balances
 */

export class Transaction {
  public readonly sender: string;
  public readonly receiver: string;
  public readonly amount: number;
  public readonly timestamp: number;

  constructor(sender: string, receiver: string, amount: number) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  // Validate if the sender has sufficient balance for this transaction
  public isValid(balance: number): { valid: boolean; reason?: string } {
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
  public toString(): string {
    if (this.sender === 'COINBASE') {
      return `[COINBASE] → ${this.receiver}: ${this.amount} coins`;
    }
    return `${this.sender} → ${this.receiver}: ${this.amount} coins`;
  }

  // Serializes transaction for hashing
  public serialize(): string {
    return JSON.stringify({
      sender: this.sender,
      receiver: this.receiver,
      amount: this.amount,
      timestamp: this.timestamp
    });
  }

  // Factory method for coinbase / mining reward transactions
  public static createCoinbase(miner: string, reward: number): Transaction {
    const tx = new Transaction('COINBASE', miner, reward);
    (tx as any).timestamp = Date.now();
    return tx;
  }
}
