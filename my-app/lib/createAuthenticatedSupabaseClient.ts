// File: lib/supabaseAuth.ts

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { Session } from 'next-auth';

export function createAuthenticatedSupabaseClient(session: Session | null) {

    //@ts-ignore
  if (!session || !session.user?.address) {
    throw new Error('Invalid session or missing user address');
  }
    //@ts-ignore
  const userAddress = session.user.address;

  // Generate Supabase JWT
  const supabaseJwtPayload = {
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    sub: userAddress,
    role: 'authenticated',
  };

  const supabaseToken = jwt.sign(
    supabaseJwtPayload,
    'RE+FUccj2m8fXRGt+F2mEiTMu1mM23php6xhI4oc2GMOGWrht1n412e6duNUojhZb11xJOIGzNZ7DuAKaHbHlA=='
  );

  // Create and return Supabase client with the generated JWT
  return createClient(
    'https://wudztumjhzxohfzaidyc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHp0dW1qaHp4b2hmemFpZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDc3MzgsImV4cCI6MjA1NTcyMzczOH0.yxL7We8G5Lq4_fWZGeK7MHYaa6ymhxYaTauCXN0Bzc0',
    {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
    }
  );
}