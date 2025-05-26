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
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '9', 10);
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  try {
    const supabase = createAuthenticatedSupabaseClient(session);

    // Fetch gigs with pagination and search
    let query = supabase
      .from('gigs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: recentGigs, error: gigsError, count } = await query
      .range(offset, offset + limit - 1);

    if (gigsError) throw gigsError;

    if (!recentGigs || recentGigs.length === 0) {
      return NextResponse.json({ message: 'No gigs found' }, { status: 404 });
    }

    // Fetch creator profiles for the gigs
    const creatorAddresses = recentGigs.map(gig => gig.creator_address);
    const { data: creatorProfiles, error: profilesError } = await supabase
      .from('gig_profile')
      .select('*')
      .in('evmAddress', creatorAddresses);

    if (profilesError) throw profilesError;

    // Combine gig and creator profile data
    const responseData = recentGigs.map(gig => ({
      gig,
      creatorProfile: creatorProfiles.find(profile => profile.evmAddress === gig.creator_address)
    }));

    return NextResponse.json({
      gigs: responseData,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count ?? 0) / limit)
    });
  } catch (error) {
    console.error('Error fetching recent gigs and profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch recent gigs and profiles' }, { status: 500 });
  }
}