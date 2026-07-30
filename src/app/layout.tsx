import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ArcEyes | Agentic Wallet + MCP Action Layer for Arc',
  description: 'Connect your wallet to ChatGPT, Claude, and AI assistants. Ask your AI, approve with ArcEyes, execute on Arc EVM.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
