# ArcEyes System Architecture

ArcEyes acts as the secure permissioned bridge between conversational AI clients (ChatGPT, Claude, Custom MCP Agents) and the Arc EVM blockchain.

```text
                    USER
                     │
              ┌──────┴──────┐
              │             │
           ChatGPT        Claude
              │             │
              └──────┬──────┘
                     │
                MCP Protocol
                     │
                     ▼
             ┌───────────────┐
             │ ArcEyes MCP   │
             │    Server     │
             └───────┬───────┘
                     │
              ArcEyes Backend
                     │
        ┌────────────┼────────────┐
        │            │            │
     Privy       Arc RPC      Protocols
        │                         │
   User Wallet                DEX / NFT /
                              DeFi / Bridge
```

## Security Invariants

1. **Zero Private Key Exposure:** AI clients only receive transaction previews and approval URLs (`/approve/[approvalId]`). Private keys never leave the user's Privy embedded wallet.
2. **Mandatory Human Approval:** No financial transactions execute autonomously without user approval in the Paybox UI window.
3. **Granular OAuth Scopes:** Permissions (`wallet:read`, `trade:quote`, `trade:prepare`) are strictly enforced per connected AI client.
