import { BlockData } from './types';
export declare class Block {
    index: number;
    timestamp: number;
    data: BlockData;
    previousHash: string;
    nonce: number;
    hash: string;
    constructor(index: number, data: BlockData, previousHash?: string, nonce?: number, timestamp?: number, hash?: string);
    calculateHash(): string;
    mineBlock(difficulty: number): number;
    hasValidHash(difficulty: number): boolean;
    toString(): string;
    clone(): Block;
}
//# sourceMappingURL=Block.d.ts.map