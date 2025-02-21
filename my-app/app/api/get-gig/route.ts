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
  const gig_id = searchParams.get('gig_id');

  if (!gig_id) {
    return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 });
  }

  try {
    const supabase = createAuthenticatedSupabaseClient(session);

    // Fetch gig data
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('*')
      .eq('gig_id', gig_id)
      .single();

    if (gigError) throw gigError;

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Fetch creator profile data
    const { data: creatorProfile, error: profileError } = await supabase
      .from('gig_profile')
      .select('*')
      .eq('evmAddress', gig.creator_address)
      .single();

    if (profileError) throw profileError;

    // Combine gig and creator profile data
    const responseData = {
      gig,
      creatorProfile
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching gig and profile:', error);
    return NextResponse.json({ error: 'Failed to fetch gig and profile' }, { status: 500 });
  }
}