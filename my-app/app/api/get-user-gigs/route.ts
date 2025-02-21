// pages/api/fetch-user-gigs.ts
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  if (!session || !session.user?.address) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const creator = searchParams.get('creator');

  if (!creator) {
    return NextResponse.json({ error: 'Creator address is required' }, { status: 400 });
  }

  try {
    const supabase = createAuthenticatedSupabaseClient(session);

    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('creator_address', creator);

    if (error) throw error;

    return NextResponse.json({ gigs: data });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}