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
         <Alert className="rounded-none border-none bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg mb-6 mt-6 xl:mt-0 ">
            <AlertDescription className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-x-4 py-0">
              <div className="flex items-center gap-2 text-lg">
                <span role="img" aria-label="celebration" className="text-2xl animate-bounce">🎉</span>
                <span className="font-semibold">Big news!</span> 
                <span className="hidden sm:inline">StreamBill is now part of Gitcoin Grants Round 22</span>
                <span className="sm:hidden">Support us on Gitcoin G22</span>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-transform duration-200 whitespace-nowrap text-base px-6 py-2"
                asChild
              >
                <a 
                  href="https://explorer.gitcoin.co/#/round/42161/608/148" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Support Us →
                </a>
              </Button>
            </AlertDescription>
          </Alert>

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