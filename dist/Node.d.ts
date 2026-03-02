import { Blockchain } from './Blockchain';
import { Block } from './Block';
/**
 * Represents a node in the blockchain network
 * Each node maintains its own copy of the blockchain
 * Handles peer connections and chain synchronization
 */
export declare class Node {
    name: string;
    blockchain: Blockchain;
    peers: Node[];
    color: string;
    constructor(name: string, blockchain: Blockchain);
    private getColorForNode;
    connectTo(peer: Node): void;
    broadcastBlock(block: Block): void;
    /**
     * Receives a block from a peer
     * Validates and adds if valid, triggers fork resolution if needed
     */
    receiveBlock(block: Block, fromPeer: string): boolean;
    /**
     * Synchronizes with a specific peer
     * Implements longest chain rule for fork resolution
     */
    syncWith(peer: Node): boolean;
    syncWithNetwork(): void;
    printState(): void;
    mineAndBroadcast(minerName: string): Block;
}
/**
 * Creates a fork scenario between two nodes
 * Each node accepts a different competing block at the same height
 */
export declare function createForkScenario(nodeA: Node, nodeB: Node, competingBlockA: Block, competingBlockB: Block): void;
//# sourceMappingURL=Node.d.ts.map