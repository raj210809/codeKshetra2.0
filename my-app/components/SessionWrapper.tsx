// components/SessionWrapper.tsx
'use client';

import { useSession } from 'next-auth/react';

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  // You can use the session data here or pass it down to children if needed
  
  return <>{children}</>;
}