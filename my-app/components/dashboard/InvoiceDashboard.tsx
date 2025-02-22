import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceTable from './InvoiceTable';
import StatsCard from './StatsCard';
import { InvoiceChart } from './Chart';
import { useAccount } from 'wagmi';
import { useWithdrawableAmounts } from '@/hooks/useWithdrawableAmounts';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

interface InvoiceStats {
  totalExpectedAmount: string;
  totalInvoices: number;
}

interface InvoiceStats {
  totalExpectedAmount: string;
  totalInvoices: number;
}

interface Stream {
  stream_id: number;
  chain_id: number;
}

const InvoiceDashboard = () => {
  const [invoiceStatsAsPayee, setInvoiceStatsAsPayee] = useState<InvoiceStats>({
    totalExpectedAmount: '0',
    totalInvoices: 0
  });

  const [invoiceStatsAsPayer, setInvoiceStatsAsPayer] = useState<InvoiceStats>({
    totalExpectedAmount: '0',
    totalInvoices: 0
  });

  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const { withdrawableAmounts, isLoading: isLoadingWithdrawable } = useWithdrawableAmounts(streams);

  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoiceStatsAsPayee = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/user-invoice-stats-as-payee?user_address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch invoice stats');
        const data = await response.json();
        setInvoiceStatsAsPayee(data);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
        toast({
          title: 'Error fetching invoice stats as payee',
          description: error as string,
          variant: 'destructive',
        });
      }
    };

    const fetchInvoiceStatsAsPayer = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/user-invoice-stats-as-payer?user_address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch invoice stats');
        const data = await response.json();
        setInvoiceStatsAsPayer(data);
      } catch (error) {
        console.error('Error fetching invoice stats:', error);
        toast({
          title: 'Error fetching invoice stats as payer',
          description: error as string,
          variant: 'destructive',
        });
      }
    };

    const fetchStreams = async () => {
      if (!address) return;

      try {
        const response = await fetch(`/api/get-total-withdrawable-amount?address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch streams');
        const data = await response.json();
        setStreams(data);
      } catch (error) {
        console.error('Error fetching streams:', error);
        toast({
          title: 'Error fetching streams stats',
          description: error as string,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoiceStatsAsPayee();
    fetchInvoiceStatsAsPayer();
    fetchStreams();
  }, [address]);


  const totalWithdrawableAmount = withdrawableAmounts?.reduce((total, { amount }) => 
    total + (amount ?? 0), 0
  ) ?? 0;

  // Function to format the amount to 2 decimal places
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  useEffect(() => {
    console.log(withdrawableAmounts)
   console.log(totalWithdrawableAmount)

  }, [totalWithdrawableAmount])


  return (
    <div className="container mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>
      
      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          description={'Total expected amount'} 
          amount={loading ? 'Loading...' : `$${formatAmount(Number(invoiceStatsAsPayee.totalExpectedAmount))}`} 
        />
        <StatsCard 
          description={'Available to withdraw'} 
          amount={loading || isLoadingWithdrawable ? 'Loading...' : `$${formatAmount(totalWithdrawableAmount)}`} 
        />
        <StatsCard 
          description={'Invoices sent'} 
          amount={loading ? 'Loading...' : invoiceStatsAsPayee.totalInvoices.toString()} 
        />
        <StatsCard description={'Invoices Received'} amount={loading ? 'Loading...' : invoiceStatsAsPayer.totalInvoices.toString()} />
      </div>

      <div>
        <InvoiceChart />

      </div>

      <Tabs defaultValue="invoicesSent">
        <TabsList>
          <TabsTrigger value="invoicesSent">Invoices sent</TabsTrigger>
          <TabsTrigger value="invoicesReceived">Invoices received</TabsTrigger>
        </TabsList>
        <TabsContent value="invoicesSent">
          <InvoiceTable type="invoicesSent" />
        </TabsContent>
        <TabsContent value="invoicesReceived">
          <InvoiceTable type="invoicesReceived" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceDashboard;