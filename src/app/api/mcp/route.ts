import { NextResponse } from 'next/server';
import { handleGetWallet, handleGetBalance, handleGetPortfolio } from '@/lib/mcp/tools/wallet';
import { handleGetSwapQuote, handlePrepareSwap } from '@/lib/mcp/tools/trading';
import { handlePrepareSend, handlePrepareBridge } from '@/lib/mcp/tools/transfers';
import { handleGetNFTs } from '@/lib/mcp/tools/nfts';
import { handleGetDeFiPositions } from '@/lib/mcp/tools/defi';
import { handleGetApprovalStatus } from '@/lib/mcp/tools/approvals';
import { getNetworkStatus } from '@/lib/arc/client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      name: 'arceyes-mcp-server',
      status: 'online',
      protocol: 'Model Context Protocol (Remote HTTP Transport)',
      network: 'Arc Testnet (Chain ID 763373)',
      endpoints: {
        mcp: '/api/mcp',
        docs: '/connect/mcp',
      },
      capabilities: ['wallet', 'balances', 'portfolio', 'swap_quote', 'prepare_swap', 'prepare_send', 'nfts', 'defi', 'approval_status'],
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { method, params, id = 1 } = body;

    // Handle MCP protocol initialization
    if (method === 'initialize') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'arceyes-mcp', version: '1.0.0' },
          },
        },
        { headers: corsHeaders }
      );
    }

    // Handle MCP tools list (tools/list or list_tools)
    if (method === 'tools/list' || method === 'list_tools') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'arc_get_wallet',
                description: 'Get logged in user ArcEyes embedded wallet address on Arc Testnet',
                inputSchema: { type: 'object', properties: {} },
              },
              {
                name: 'arc_get_balance',
                description: 'Get native ARC token balance for the user embedded wallet',
                inputSchema: { type: 'object', properties: {} },
              },
              {
                name: 'arc_get_portfolio',
                description: 'Get full portfolio token breakdown and USD valuations',
                inputSchema: { type: 'object', properties: {} },
              },
              {
                name: 'arc_get_swap_quote',
                description: 'Get DEX swap quote for Arc EVM tokens',
                inputSchema: {
                  type: 'object',
                  properties: {
                    tokenIn: { type: 'string', description: 'Symbol of token to swap from (e.g. USDC)' },
                    tokenOut: { type: 'string', description: 'Symbol of token to swap to (e.g. XYZ)' },
                    amount: { type: 'string', description: 'Amount to swap (e.g. 10)' },
                    slippage: { type: 'string', description: 'Allowed slippage (default 0.5%)' },
                  },
                  required: ['tokenIn', 'tokenOut', 'amount'],
                },
              },
              {
                name: 'arc_prepare_swap',
                description: 'Prepare DEX swap & create ArcEyes user approval request',
                inputSchema: {
                  type: 'object',
                  properties: {
                    tokenIn: { type: 'string' },
                    tokenOut: { type: 'string' },
                    amount: { type: 'string' },
                    slippage: { type: 'string' },
                  },
                  required: ['tokenIn', 'tokenOut', 'amount'],
                },
              },
              {
                name: 'arc_prepare_send',
                description: 'Prepare token transfer to recipient & create approval request',
                inputSchema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    amount: { type: 'string' },
                    recipient: { type: 'string' },
                  },
                  required: ['token', 'amount', 'recipient'],
                },
              },
              {
                name: 'arc_get_approval_status',
                description: 'Get execution status & transaction hash for an approval request ID',
                inputSchema: {
                  type: 'object',
                  properties: {
                    approval_id: { type: 'string' },
                  },
                  required: ['approval_id'],
                },
              },
            ],
          },
        },
        { headers: corsHeaders }
      );
    }

    if (method === 'tools/call' || method === 'call_tool') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      let resultData: any;

      switch (toolName) {
        case 'arc_get_wallet':
          resultData = await handleGetWallet();
          break;
        case 'arc_get_balance':
          resultData = await handleGetBalance();
          break;
        case 'arc_get_portfolio':
          resultData = await handleGetPortfolio();
          break;
        case 'arc_get_swap_quote':
          resultData = await handleGetSwapQuote(toolArgs.tokenIn || 'USDC', toolArgs.tokenOut || 'XYZ', toolArgs.amount || '10', toolArgs.slippage);
          break;
        case 'arc_prepare_swap':
          resultData = await handlePrepareSwap(toolArgs.tokenIn || 'USDC', toolArgs.tokenOut || 'XYZ', toolArgs.amount || '10', toolArgs.slippage);
          break;
        case 'arc_prepare_send':
          resultData = await handlePrepareSend(toolArgs.token || 'USDC', toolArgs.amount || '5', toolArgs.recipient);
          break;
        case 'arc_prepare_bridge':
          resultData = await handlePrepareBridge(toolArgs.token || 'USDC', toolArgs.amount || '10', toolArgs.sourceChain || 'Ethereum Sepolia', toolArgs.targetChain || 'Arc Testnet');
          break;
        case 'arc_get_approval_status':
          resultData = await handleGetApprovalStatus(toolArgs.approval_id);
          break;
        case 'arc_get_nfts':
          resultData = await handleGetNFTs();
          break;
        case 'arc_get_defi_positions':
          resultData = await handleGetDeFiPositions();
          break;
        case 'arc_get_network_status':
          resultData = await getNetworkStatus();
          break;
        default:
          resultData = { message: 'Action executed successfully', params: toolArgs };
      }

      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(resultData, null, 2) }],
          },
        },
        { headers: corsHeaders }
      );
    }

    // Direct invocation fallback if called as plain REST POST
    const resultData = await handleGetWallet();
    return NextResponse.json({ jsonrpc: '2.0', id, result: resultData }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
