import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  try {
    const body = await request.json();
    const { 
      satisfactionLevel,
      reasonForRating,
      alternativeSolution,
      mainBenefit,
      idealCustomer,
      improvementSuggestions 
    } = body;

    const supabase = createAuthenticatedSupabaseClient(session);

    // Required fields validation
    if (!satisfactionLevel || !reasonForRating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const feedbackData = {
      //@ts-ignore
      evmAddress: session?.user?.address || null, // Optional: Include user's address if available
      satisfaction_level: satisfactionLevel,
      reason_for_rating: reasonForRating,
      alternative_solution: alternativeSolution,
      main_benefit: mainBenefit,
      ideal_customer: idealCustomer,
      improvement_suggestions: improvementSuggestions
    };

    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Feedback submitted successfully', data });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
} 