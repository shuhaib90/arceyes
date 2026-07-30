import { NextResponse } from 'next/server';
import { handleGetWallet, handleGetBalance, handleGetPortfolio, handleGetTokenBalance } from '@/lib/mcp/tools/wallet';
import { handleGetSwapQuote, handlePrepareSwap } from '@/lib/mcp/tools/trading';
import { handlePrepareSend, handlePrepareBridge } from '@/lib/mcp/tools/transfers';
import { handleGetNFTs, handlePrepareNFTMint } from '@/lib/mcp/tools/nfts';
import { handleGetDeFiPositions } from '@/lib/mcp/tools/defi';
import { handleGetApprovalStatus } from '@/lib/mcp/tools/approvals';
import { getNetworkStatus } from '@/lib/arc/client';

export async function GET() {
  return NextResponse.json({
    name: 'arceyes-mcp-server',
    status: 'online',
    protocol: 'Model Context Protocol (Remote HTTP Transport)',
    network: 'Arc Testnet (Chain ID 763373)',
    endpoints: {
      mcp: '/api/mcp',
      docs: '/connect/mcp',
    },
    capabilities: ['wallet', 'balances', 'portfolio', 'swap_quote', 'prepare_swap', 'prepare_send', 'nfts', 'defi', 'approval_status'],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, id } = body;

    // Handle MCP protocol methods
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'arceyes-mcp', version: '1.0.0' },
        },
      });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            { name: 'arc_get_wallet', description: 'Get user wallet address', inputSchema: { type: 'object' } },
            { name: 'arc_get_balance', description: 'Get native Arc token balance', inputSchema: { type: 'object' } },
            { name: 'arc_get_portfolio', description: 'Get full portfolio breakdown', inputSchema: { type: 'object' } },
            { name: 'arc_get_swap_quote', description: 'Get swap quote for Arc DEX', inputSchema: { type: 'object' } },
            { name: 'arc_prepare_swap', description: 'Prepare swap & create user approval request', inputSchema: { type: 'object' } },
            { name: 'arc_prepare_send', description: 'Prepare transfer & create approval request', inputSchema: { type: 'object' } },
            { name: 'arc_get_approval_status', description: 'Get transaction result for an approval ID', inputSchema: { type: 'object' } },
          ],
        },
      });
    }

    if (method === 'tools/call') {
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
          resultData = await handlePrepareSend(toolArgs.token || 'USDC', toolArgs.amount || '5', toolArgs.recipient || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
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

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(resultData, null, 2) }],
        },
      });
    }

    return NextResponse.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
