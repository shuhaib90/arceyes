# ArcEyes 👁 &bull; Agentic Wallet + MCP for Arc

**ArcEyes** is a production-ready Agentic Wallet and Model Context Protocol (MCP) action layer for the **Arc EVM ecosystem**.

It enables natural language AI assistants (ChatGPT, Claude, Custom MCP clients) to interact with Arc EVM while ensuring **private keys never leave Privy** and **all financial transactions require explicit user authorization** through the ArcEyes Paybox-style approval window (`/approve/[approvalId]`).

---

## ⚡ Target Experience

```text
Ask your AI → ArcEyes MCP prepares → User approves in ArcEyes → Privy embedded wallet signs → Arc executes → AI gets result
```

Example inside ChatGPT:
> **User:** "Swap 10 USDC to XYZ on Arc."  
> **ChatGPT:** "I found a route on ArcDEX Aggregator. 10 USDC will return ≈ 245 XYZ. ArcEyes needs your approval: [Open ArcEyes Approval](http://localhost:3000/approve/appr_demo_swap_100)"  
> **User:** Clicks Approve in ArcEyes Paybox window.  
> **Privy Wallet:** Signs transaction locally and broadcasts to Arc Testnet.  
> **ChatGPT:** "Swap completed. 10 USDC → 245 XYZ."

---

## 🏗 Technology Stack

- **Frontend Framework:** Next.js 15 (App Router, TypeScript, React 19)
- **Styling:** High-contrast crisp black & white neo-brutalist theme (Tailwind CSS v4)
- **Auth & Embedded Wallet:** Privy (`@privy-io/react-auth`, Google OAuth, embedded EVM wallet)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) policies (`supabase/schema.sql`)
- **Blockchain EVM:** Viem & Arc Testnet RPC (Chain ID 763373)
- **MCP Server:** Official `@modelcontextprotocol/sdk` TypeScript SDK with Streamable HTTP transport (`/api/mcp`)
- **Validation:** Zod schemas

---

## 🚀 Quick Start & Local Execution

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/arceyes/arceyes.git
cd serene-faraday
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration variables:
```env
NEXT_PUBLIC_PRIVY_APP_ID=cm0x_arceyes_app_id
PRIVY_APP_SECRET=privy_secret_key
NEXT_PUBLIC_SUPABASE_URL=https://arceyes-demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=763373
ARC_EXPLORER_URL=https://explorer.testnet.arc.network
APP_URL=http://localhost:3000
```

### 3. Database Schema Setup
Run the SQL schema in your Supabase SQL Editor:
```bash
supabase/schema.sql
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Testing MCP Tools Locally

You can query the remote MCP endpoint via `POST /api/mcp`:

### List MCP Tools
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Request Swap Quote (`arc_get_swap_quote`)
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"arc_get_swap_quote","arguments":{"tokenIn":"USDC","tokenOut":"XYZ","amount":"10"}}}'
```

### Prepare Swap & Create Pending Approval (`arc_prepare_swap`)
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"arc_prepare_swap","arguments":{"tokenIn":"USDC","tokenOut":"XYZ","amount":"10"}}}'
```

---

## 📚 Documentation Index

- [Architecture Overview](docs/architecture.md)
- [Remote MCP Specifications](docs/mcp.md)
- [Privy Embedded Wallet Integration](docs/privy.md)
- [Security & Scope Permissions](docs/security.md)
- [Arc EVM Chain Setup](docs/arc.md)
- [Protocol Adapters (DEX, NFT, DeFi)](docs/protocol-adapters.md)
- [ChatGPT Connection Guide](docs/chatgpt.md)
- [Claude Connection Guide](docs/claude.md)
