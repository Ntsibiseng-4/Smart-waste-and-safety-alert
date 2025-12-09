
import { BlockchainBlock } from '../types';
import { generateHash } from './cryptoService';

export class Blockchain {
  public chain: BlockchainBlock[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): BlockchainBlock {
    return {
      index: 0,
      timestamp: new Date().toISOString(),
      action: 'GENESIS_BLOCK',
      actor: 'SYSTEM',
      resourceId: '000',
      previousHash: '0',
      hash: '00000000000000000000000000000000'
    };
  }

  public getLatestBlock(): BlockchainBlock {
    return this.chain[this.chain.length - 1];
  }

  public async addBlock(action: string, actor: string, resourceId: string): Promise<BlockchainBlock> {
    const previousBlock = this.getLatestBlock();
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    
    // Create the hash content
    const content = `${index}${timestamp}${action}${actor}${resourceId}${previousBlock.hash}`;
    const hash = await generateHash(content);

    const newBlock: BlockchainBlock = {
      index,
      timestamp,
      action,
      actor,
      resourceId,
      previousHash: previousBlock.hash,
      hash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  public isChainValid(): boolean {
    // Basic integrity check logic
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}
