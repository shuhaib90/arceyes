# Privy Integration & Embedded Wallet Security

ArcEyes uses **Privy** (`@privy-io/react-auth`) for:
- Google OAuth login
- Embedded EVM wallet creation
- Wallet identity mapping
- Client-side transaction signing

## Service Abstractions

- `getCurrentUserSession()`: Resolves active user session and wallet mapping.
- `getUserWallet()`: Retrieves embedded wallet metadata.
- `signTransaction()`: Triggers client-side Privy wallet signing modal/hook without exposing keys to server or AI.
