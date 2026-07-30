import { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['google', 'email', 'wallet'],
  appearance: {
    theme: 'dark',
    accentColor: '#ffffff',
    logo: 'https://arceyes.xyz/logo.png',
    showWalletLoginFirst: false,
  },
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  defaultChain: {
    id: 763373,
    name: 'Arc Testnet',
    network: 'arc-testnet',
    nativeCurrency: {
      name: 'Arc',
      symbol: 'ARC',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.testnet.arc.network'],
      },
      public: {
        http: ['https://rpc.testnet.arc.network'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Arc Explorer',
        url: 'https://explorer.testnet.arc.network',
      },
    },
  },
};
