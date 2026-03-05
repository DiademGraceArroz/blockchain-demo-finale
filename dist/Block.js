"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const crypto_1 = require("crypto");
const Transaction_1 = require("./Transaction");
// Block class representing a single block in the blockchain
class Block {
    constructor(index, data, previousHash = '', nonce = 0, timestamp, hash) {
        this.index = index;
        this.timestamp = timestamp ?? Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        // Use provided hash or calculate initial hash
        this.hash = hash ?? this.calculateHash();
    }
    // Calculates SHA-256 hash of all block fields
    calculateHash() {
        const dataString = JSON.stringify(this.data);
        const blockString = this.index +
            this.timestamp +
            dataString +
            this.previousHash +
            this.nonce;
        return (0, crypto_1.createHash)('sha256').update(blockString).digest('hex');
    }
    // Mines the block until a valid hash is found
    mineBlock(difficulty) {
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
    hasValidHash(difficulty) {
        const recalculatedHash = this.calculateHash();
        const target = '0'.repeat(difficulty);
        return (this.hash === recalculatedHash &&
            this.hash.substring(0, difficulty) === target);
    }
    toString() {
        const txSummary = this.data.transactions
            .map(tx => tx.toString())
            .join(', ');
        return `Block #${this.index} [${this.hash.substring(0, 10)}...] | ` +
            `Miner: ${this.data.miner} | Nonce: ${this.nonce} | ` +
            `Tx: [${txSummary}]`;
    }
    // Creates a copy of the block
    clone() {
        const clonedData = {
            miner: this.data.miner,
            transactions: this.data.transactions.map(tx => new Transaction_1.Transaction(tx.sender, tx.receiver, tx.amount))
        };
        const block = new Block(this.index, clonedData, this.previousHash, this.nonce);
        block.timestamp = this.timestamp;
        block.hash = this.hash;
        return block;
    }
}
exports.Block = Block;
//# sourceMappingURL=Block.js.map