import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import ViewInvoiceDialog from './ViewInvoiceDialog';
import { IInvoiceData } from '@/types/interfaces';
import { AlertCircle } from 'lucide-react';
import ResendInvoice from '../dashboard/ResendInvoice';

interface NotPaidInvoiceProps {
  requestId: string;
  invoiceData: IInvoiceData;
}

const NotPaidInvoice: React.FC<NotPaidInvoiceProps> = ({ requestId, invoiceData }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShareInvoice = () => {
    const link =  `http://localhost:3000/pay-invoice/${requestId}`; //env
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The invoice link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 3000); // Reset after 3 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "There was an error copying the link. Please try again.",
        variant: "destructive",
      });
    });
  };

  const isPastDue = new Date(invoiceData.paymentDetails.dueDate) < new Date()


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-4">
          <p className="text-center text-lg font-semibold">
            The invoice has not been paid yet
          </p>
          {isPastDue && (
            <div className="flex items-center justify-center space-x-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">This invoice is past due</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-1 space-y-4 justify-center">
          <Button 
            variant="outline" 
            onClick={handleShareInvoice}
            disabled={isCopied}
          >
            {isCopied ? "Link Copied!" : "Share invoice to payer"}
          </Button>
      
          <ViewInvoiceDialog invoiceData={invoiceData} />
          {isPastDue && (
            <ResendInvoice invoiceData={invoiceData} />
          )}
        </CardFooter>
      </Card>
    </div>
  )
};

export default NotPaidInvoice;