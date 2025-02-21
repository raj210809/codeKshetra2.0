import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';

export async function GET(request: Request) {
    // Get the NextAuth session

    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    //@ts-ignore
    if (!session || !session.user?.address) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        // Create authenticated Supabase client
        // console.log(session)
        // This will throw an error if the session is invalid
        const supabase = createAuthenticatedSupabaseClient(session);

        // Your Supabase query here
        const { data, error } = await supabase
            .from('user_details')
            .select('*')
            //@ts-ignore
            .eq('evmAddress', address);

        console.log("data", data)

        if (error) throw error;

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error && error.message === 'Invalid session or missing user address') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}