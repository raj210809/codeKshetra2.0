// app/api/invoice-chart-data/route.ts

import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { parseISO, format } from 'date-fns';

// Define the structure of an invoice from Supabase
interface Invoice {
  due_date: string; // This will be a string representation of the timestampz
  expected_amount: string; // Assuming this is stored as a string in Supabase
}

// Define the structure of our aggregated data
interface AggregatedData {
  date: string;
  expectedAmount: number;
  invoicesSent: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_address = searchParams.get('user_address');

  if (!user_address) {
    return NextResponse.json({ message: 'User address is required' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  //@ts-ignore
  if(!session || !session.user?.address){
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // Get data for the last 3 months
    const supabase = createAuthenticatedSupabaseClient(session);
    const { data, error } = await supabase
      .from('testnet_invoices')
      .select('due_date, expected_amount')
      .eq('payee_evm_address', user_address)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process the data to aggregate by day
    const aggregatedData = (data as Invoice[]).reduce((acc: { [key: string]: AggregatedData }, invoice) => {
      const date = invoice.due_date; // Use the UTC date string directly
      if (!acc[date]) {
        acc[date] = { date, expectedAmount: 0, invoicesSent: 0 };
      }
      acc[date].expectedAmount += parseFloat(invoice.expected_amount);
      acc[date].invoicesSent += 1;
      return acc;
    }, {});

    // Convert to array and sort by date
    const chartData = Object.values(aggregatedData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    console.log('Chart Data');
    console.log(chartData);

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    return NextResponse.json({ message: 'Error fetching invoice data' }, { status: 500 });
  }
}