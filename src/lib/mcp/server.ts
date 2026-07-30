import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { handleGetWallet, handleGetBalance, handleGetPortfolio, handleGetTokenBalance } from './tools/wallet';
import { handleGetSwapQuote, handlePrepareSwap } from './tools/trading';
import { handlePrepareSend, handlePrepareBridge } from './tools/transfers';
import { handleGetNFTs, handlePrepareNFTMint } from './tools/nfts';
import { handleGetDeFiPositions } from './tools/defi';
import { handleReadContract, handlePrepareContractCall } from './tools/contracts';
import { handleGetApprovalStatus } from './tools/approvals';
import { getNetworkStatus } from '@/lib/arc/client';
import { getTokenBySymbolOrAddress } from '@/lib/arc/tokens';
import { getTransactionStatus } from '@/lib/arc/transactions';

export function createArcEyesMCPServer() {
  const server = new Server(
    {
      name: 'arceyes-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Tool Definitions Schema
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'arc_get_wallet',
          description: "Get the authenticated user's Arc wallet address and network info",
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_get_balance',
          description: 'Get native Arc token balance of the wallet',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_get_portfolio',
          description: 'Get full portfolio breakdown including native Arc, ERC20 tokens, and USD values',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_get_token_balance',
          description: 'Get balance for a specific token symbol or contract address',
          inputSchema: {
            type: 'object',
            properties: { token: { type: 'string', description: 'Token symbol (e.g. USDC, XYZ) or contract address' } },
            required: ['token'],
          },
        },
        {
          name: 'arc_get_network_status',
          description: 'Check status of Arc EVM network and current block number',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_get_token_info',
          description: 'Get token metadata for a given symbol or contract address',
          inputSchema: {
            type: 'object',
            properties: { token: { type: 'string', description: 'Token symbol or address' } },
            required: ['token'],
          },
        },
        {
          name: 'arc_get_swap_quote',
          description: 'Get trade quote for swapping tokens on Arc DEX aggregator',
          inputSchema: {
            type: 'object',
            properties: {
              tokenIn: { type: 'string', description: 'Input token symbol (e.g. USDC)' },
              tokenOut: { type: 'string', description: 'Output token symbol (e.g. XYZ)' },
              amount: { type: 'string', description: 'Amount to swap' },
              slippage: { type: 'string', description: 'Optional slippage tolerance (e.g. 0.5%)' },
            },
            required: ['tokenIn', 'tokenOut', 'amount'],
          },
        },
        {
          name: 'arc_prepare_swap',
          description: 'Prepare a swap transaction and create an ArcEyes user approval request. Does NOT sign automatically.',
          inputSchema: {
            type: 'object',
            properties: {
              tokenIn: { type: 'string', description: 'Input token symbol (e.g. USDC)' },
              tokenOut: { type: 'string', description: 'Output token symbol (e.g. XYZ)' },
              amount: { type: 'string', description: 'Amount to swap' },
              slippage: { type: 'string', description: 'Slippage (default 0.5%)' },
            },
            required: ['tokenIn', 'tokenOut', 'amount'],
          },
        },
        {
          name: 'arc_prepare_send',
          description: 'Prepare a token transfer transaction and create an ArcEyes user approval request.',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'Token symbol or contract address' },
              amount: { type: 'string', description: 'Amount to send' },
              recipient: { type: 'string', description: 'Recipient EVM address' },
            },
            required: ['token', 'amount', 'recipient'],
          },
        },
        {
          name: 'arc_prepare_bridge',
          description: 'Bridge USDC/native tokens across blockchains (Arc Testnet <-> Ethereum Sepolia / Solana / Arbitrum) via Circle CCTP.',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'Token symbol (e.g. USDC)' },
              amount: { type: 'string', description: 'Amount to bridge' },
              sourceChain: { type: 'string', description: 'Source chain name (e.g. Arc Testnet, Ethereum Sepolia, Solana)' },
              targetChain: { type: 'string', description: 'Target chain name (e.g. Ethereum Sepolia, Arc Testnet)' },
            },
            required: ['token', 'amount', 'sourceChain', 'targetChain'],
          },
        },
        {
          name: 'arc_get_nfts',
          description: "Get user's NFT collection holdings on Arc",
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_prepare_nft_mint',
          description: 'Prepare an NFT mint transaction and create an approval request',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: { type: 'string', description: 'NFT contract address' },
              quantity: { type: 'number', description: 'Quantity to mint' },
            },
          },
        },
        {
          name: 'arc_get_defi_positions',
          description: "Get user's active liquidity pool and lending positions on Arc DeFi protocols",
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'arc_read_contract',
          description: 'Read data from a smart contract on Arc EVM',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: { type: 'string' },
              methodName: { type: 'string' },
              args: { type: 'array' },
            },
            required: ['contractAddress', 'methodName'],
          },
        },
        {
          name: 'arc_prepare_contract_call',
          description: 'Prepare a custom smart contract transaction call and create an approval request',
          inputSchema: {
            type: 'object',
            properties: {
              contractAddress: { type: 'string' },
              methodName: { type: 'string' },
              args: { type: 'array' },
            },
            required: ['contractAddress', 'methodName'],
          },
        },
        {
          name: 'arc_get_approval_status',
          description: 'Check approval status and broadcasted transaction result for a given approval ID',
          inputSchema: {
            type: 'object',
            properties: {
              approval_id: { type: 'string', description: 'Approval ID returned by arc_prepare_* tools' },
            },
            required: ['approval_id'],
          },
        },
      ],
    };
  });

  // Tool Call Execution Handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let resultData: any;
      switch (name) {
        case 'arc_get_wallet':
          resultData = await handleGetWallet();
          break;
        case 'arc_get_balance':
          resultData = await handleGetBalance();
          break;
        case 'arc_get_portfolio':
          resultData = await handleGetPortfolio();
          break;
        case 'arc_get_token_balance':
          resultData = await handleGetTokenBalance((args as any)?.token);
          break;
        case 'arc_get_network_status':
          resultData = await getNetworkStatus();
          break;
        case 'arc_get_token_info':
          resultData = getTokenBySymbolOrAddress((args as any)?.token);
          break;
        case 'arc_get_swap_quote':
          resultData = await handleGetSwapQuote((args as any)?.tokenIn, (args as any)?.tokenOut, (args as any)?.amount, (args as any)?.slippage);
          break;
        case 'arc_prepare_swap':
          resultData = await handlePrepareSwap((args as any)?.tokenIn, (args as any)?.tokenOut, (args as any)?.amount, (args as any)?.slippage);
          break;
        case 'arc_prepare_send':
          resultData = await handlePrepareSend((args as any)?.token, (args as any)?.amount, (args as any)?.recipient);
          break;
        case 'arc_prepare_bridge':
          resultData = await handlePrepareBridge((args as any)?.token || 'USDC', (args as any)?.amount || '10', (args as any)?.sourceChain || 'Ethereum Sepolia', (args as any)?.targetChain || 'Arc Testnet');
          break;
        case 'arc_get_nfts':
          resultData = await handleGetNFTs();
          break;
        case 'arc_prepare_nft_mint':
          resultData = await handlePrepareNFTMint((args as any)?.contractAddress, (args as any)?.quantity || 1);
          break;
        case 'arc_get_defi_positions':
          resultData = await handleGetDeFiPositions();
          break;
        case 'arc_read_contract':
          resultData = await handleReadContract((args as any)?.contractAddress, (args as any)?.methodName, (args as any)?.args || []);
          break;
        case 'arc_prepare_contract_call':
          resultData = await handlePrepareContractCall((args as any)?.contractAddress, (args as any)?.methodName, (args as any)?.args || []);
          break;
        case 'arc_get_approval_status':
          resultData = await handleGetApprovalStatus((args as any)?.approval_id);
          break;
        default:
          throw new Error(`Unknown ArcEyes tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultData, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: err.message || 'Tool execution failed' }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
