import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://wudztumjhzxohfzaidyc.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHp0dW1qaHp4b2hmemFpZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDc3MzgsImV4cCI6MjA1NTcyMzczOH0.yxL7We8G5Lq4_fWZGeK7MHYaa6ymhxYaTauCXN0Bzc0';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        // Query the gig_profile view
        const { data, error } = await supabase
            .from('gig_profile')
            .select('*')
            .eq('evmAddress', address);

        if (error) throw error;

        if (data && data.length > 0) {
            return NextResponse.json(data[0]);
        } else {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}