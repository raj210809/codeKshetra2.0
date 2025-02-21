import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';




export async function POST(request: Request) {

  const session = await getServerSession(authOptions);
  //@ts-ignore
  if(!session || !session.user?.address){
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json()
    const { evmAddress, name, email, address, city, state, zip, country } = body

    const supabase = createAuthenticatedSupabaseClient(session);


    if (!evmAddress || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_details')
      .upsert(
        { evmAddress, name, email, address, city, state, zip, country },
        { onConflict: 'evmAddress', ignoreDuplicates: false }
      )

    if (error) throw error

    return NextResponse.json({ message: 'User details saved successfully', data })
  } catch (error) {
    console.error('Error saving user details:', error)
    return NextResponse.json({ error: 'Failed to save user details' }, { status: 500 })
  }
}