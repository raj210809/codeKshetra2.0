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
    '7LHhPsrFAH/qEO8H6qpSVsMLLuYQGlMI/SvJSoT1YLGvS6uBHsec4EjG3f99efVSrT11Na3IdY0ULRDAhGug3A=='
  );

  // Create and return Supabase client with the generated JWT
  return createClient(
    'https://smvodimhjegutuotvakm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdm9kaW1oamVndXR1b3R2YWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMTk3NzAsImV4cCI6MjA1NTY5NTc3MH0.oIPMGrZdnZQFGS8ccux8GtstsvE5T-pANNl4j_Lw0Hg',
    {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
    }
  );
}