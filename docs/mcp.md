# Model Context Protocol (MCP) Specifications

ArcEyes exposes a standard Remote MCP server using `@modelcontextprotocol/sdk` over Streamable HTTP transport at `/api/mcp`.

## Implemented Tools

1. `arc_get_wallet`: Returns user wallet address and network status.
2. `arc_get_balance`: Returns native ARC token balance.
3. `arc_get_portfolio`: Returns total USD portfolio breakdown.
4. `arc_get_swap_quote`: Returns DEX trade quote for token pair.
5. `arc_prepare_swap`: Creates a `PendingApproval` request and returns `approval_url`.
6. `arc_prepare_send`: Creates a token transfer `PendingApproval` request.
7. `arc_get_approval_status`: Allows AI to check status & tx hash for an approval ID.
8. `arc_get_nfts`: Returns user's NFT holdings.
9. `arc_get_defi_positions`: Returns liquidity pool & lending positions.
