# ArcEyes Security Architecture

## Contract Allowlists & Transaction Validation

Before presenting a transaction confirmation screen in the Paybox UI (`/approve/[approvalId]`), ArcEyes backend validates:
1. Target contract address against verified allowlist (`src/lib/security/allowlist.ts`)
2. Token balance sufficiency
3. Slippage bounds
4. Transaction payload simulation via Viem

## Audit Logs

All auth attempts, MCP tool calls, approval creations, approvals, and rejections are logged into `activity_logs`.
