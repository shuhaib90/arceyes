# Protocol Adapter System

ArcEyes uses a modular protocol adapter architecture to connect to DEX aggregators, NFT collections, bridges, and lending markets.

## Key Interfaces

- `DEXAdapter`: Implements `getQuote()`, `buildSwapTransaction()`, `simulateSwap()`
- `NFTAdapter`: Implements `getCollectionInfo()`, `buildMintTransaction()`
- `ProtocolRegistry`: Central registry service for routing quotes and execution.
