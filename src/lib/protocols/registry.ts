import { arcDEXAdapter } from './dex/arcDEX';
import { arcEyesNFTAdapter } from './nft/arcNFT';
import { arcBridgeAdapter, ArcBridgeAdapter } from './bridge/arcBridge';
import { DEXAdapter, NFTAdapter } from './types';

class ProtocolRegistry {
  private dexes: Map<string, DEXAdapter> = new Map();
  private nfts: Map<string, NFTAdapter> = new Map();
  private bridge: ArcBridgeAdapter = arcBridgeAdapter;

  constructor() {
    this.registerDEX(arcDEXAdapter);
    this.registerNFT(arcEyesNFTAdapter);
  }

  registerDEX(dex: DEXAdapter) {
    this.dexes.set(dex.id, dex);
  }

  registerNFT(nft: NFTAdapter) {
    this.nfts.set(nft.id, nft);
  }

  getPrimaryDEX(): DEXAdapter {
    return arcDEXAdapter;
  }

  getPrimaryNFT(): NFTAdapter {
    return arcEyesNFTAdapter;
  }

  getPrimaryBridge(): ArcBridgeAdapter {
    return this.bridge;
  }
}

export const registry = new ProtocolRegistry();
