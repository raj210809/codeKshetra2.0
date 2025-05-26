import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ShareIcon } from 'lucide-react'
import { useToast } from '../ui/use-toast'

type ShareInvoiceComponentProps ={
  requestId:string;
  wasCanceled?:boolean;
}

const ShareInvoiceComponent = ({
  requestId,
  wasCanceled
} : ShareInvoiceComponentProps) => {

  const [copied, setIsCopied] = useState(false);
  const {toast} = useToast();

  const handleShareInvoice = () => {
    const link = `http://localhost:3000/pay-invoice/${requestId}`;
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

  return (

    <Button 
            variant="outline" 
            onClick={handleShareInvoice}
            disabled={copied}
          >
          <ShareIcon className='h-4 w-4 mr-2' />  {copied ? "Link Copied!" : "Share invoice"}
          </Button>

  )
}

export default ShareInvoiceComponent