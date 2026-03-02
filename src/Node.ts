import { Blockchain } from './Blockchain';
import { Block } from './Block';

/**
 * Represents a node in the blockchain network
 * Each node maintains its own copy of the blockchain
 * Handles peer connections and chain synchronization
 */
export class Node {
  public name: string;
  public blockchain: Blockchain;
  public peers: Node[];
  public color: string;

  constructor(name: string, blockchain: Blockchain) {
    this.name = name;
    this.blockchain = blockchain;
    this.peers = [];
    this.color = this.getColorForNode(name);
  }

  private getColorForNode(name: string): string {
    const colors: { [key: string]: string } = {
      'Node A': '\x1b[32m', // Green
      'Node B': '\x1b[34m', // Blue
      'Node C': '\x1b[33m', // Yellow
      'default': '\x1b[0m'
    };
    return colors[name] || colors['default'];
  }

  // Connects to another node as a peer
  public connectTo(peer: Node): void {
    if (!this.peers.includes(peer)) {
      this.peers.push(peer);
      peer.peers.push(this);
      console.log(`  ${this.name} ↔ ${peer.name} connected`);
    }
  }

  // Broadcast a block to all connected peers
  public broadcastBlock(block: Block): void {
    console.log(`\n${this.name} broadcasting Block #${block.index}`);
    for (const peer of this.peers) {
      peer.receiveBlock(block, this.name);
    }
  }


  /**
   * Receives a block from a peer
   * Validates and adds if valid, triggers fork resolution if needed
   */
  public receiveBlock(block: Block, fromPeer: string): boolean {
    console.log(`  ${this.name} received Block #${block.index} from ${fromPeer}`);
    
    // Try to add block directly
    if (this.blockchain.addBlock(block)) {
      console.log(`${this.name} accepted Block #${block.index}`);
      return true;
    }
    
    // If direct add fails, might be part of a fork
    console.log(`${this.name} cannot add Block #${block.index} directly`);
    return false;
  }

  /**
   * Synchronizes with a specific peer
   * Implements longest chain rule for fork resolution
   */
  public syncWith(peer: Node): boolean {
    console.log(`\n${this.name} syncing with ${peer.name}...`);
    
    const myLength = this.blockchain.chain.length;
    const peerLength = peer.blockchain.chain.length;
    
    console.log(`  ${this.name} chain: ${myLength} blocks`);
    console.log(`  ${peer.name} chain: ${peerLength} blocks`);
    
    if (peerLength > myLength) {
      console.log(`  ${peer.name} has longer chain`);
      const adopted = this.blockchain.replaceChain(peer.blockchain.chain);
      if (adopted) {
        console.log(`  ✓ ${this.name} adopted ${peer.name}'s chain`);
      }
      return adopted;
    } else if (peerLength === myLength) {
      console.log(`  Chains are equal length, no sync needed`);
      return false;
    } else {
      console.log(`  ${this.name} has longer chain, no sync needed`);
      return false;
    }
  }

  // Performs full network sync with all connected peers
  public syncWithNetwork(): void {
    console.log(`\n${this.name} performing network sync...`);
    for (const peer of this.peers) {
      this.syncWith(peer);
    }
  }

  // Prints current chain state
  public printState(): void {
    console.log(`\n${this.color}=== ${this.name} State ===${'\x1b[0m'}`);
    console.log(`Chain length: ${this.blockchain.chain.length}`);
    console.log(`Latest block: ${this.blockchain.getLatestBlock().hash.substring(0, 15)}...`);
    console.log(`Cumulative work: ${this.blockchain.getCumulativeWork()}`);
    console.log(`Balances: ${this.blockchain.getBalanceString()}`);
  }

  // Mines a block and broadcasts it
  public mineAndBroadcast(minerName: string): Block {
    console.log(`\n${this.name} mining new block...`);
    const block = this.blockchain.mineBlock(minerName);
    this.broadcastBlock(block);
    return block;
  }
}

/**
 * Creates a fork scenario between two nodes
 * Each node accepts a different competing block at the same height
 */
export function createForkScenario(
  nodeA: Node,
  nodeB: Node,
  competingBlockA: Block,
  competingBlockB: Block
): void {
  console.log('\nCreating Fork Scenario...');
  console.log('Both nodes start with same parent block');
  
  // Node A accepts block A
  nodeA.blockchain.addBlock(competingBlockA);
  console.log(`  ${nodeA.name} accepted Block A: ${competingBlockA.hash.substring(0, 15)}...`);
  
  // Node B accepts block B
  nodeB.blockchain.addBlock(competingBlockB);
  console.log(`  ${nodeB.name} accepted Block B: ${competingBlockB.hash.substring(0, 15)}...`);
  
  console.log('\nFork State:');
  nodeA.printState();
  nodeB.printState();
}
