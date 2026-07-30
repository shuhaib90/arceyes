'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { privyConfig } from '@/lib/privy/client';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-black text-white min-h-screen font-mono p-6">{children}</div>;
  }

  // If App ID is present and valid format (starts with cl or cm)
  const isValidAppId = appId && (appId.startsWith('cl') || appId.startsWith('cm'));

  if (!isValidAppId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider appId={appId} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
