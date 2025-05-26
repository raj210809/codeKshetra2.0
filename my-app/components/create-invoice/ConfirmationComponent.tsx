import React, {useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormDataType } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDataInvoiceFunction } from '@/helper/mockDataInvoice';
import { format, getUnixTime } from 'date-fns';
import CreateRequestButton from './CreateRequestButton';
import { useAccount } from 'wagmi';
import { UserDetailsFromSupabase } from '@/types/interfaces';
import SellerDataFromSupabase from './SellerDataFromSupabase';
import Spinner from '../helpers/Spinner';
import Image from 'next/image';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';
import { useToast } from '../ui/use-toast';


interface ConfirmationComponentProps {
  formData: FormDataType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export function ConfirmationComponent({ formData, setStep }: ConfirmationComponentProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [sellerDetailsSupabase, setSellerDetailsSupabase] = useState<UserDetailsFromSupabase | null>(null);
  const [loading, setLoading] = useState(true);


  const totalAmount = formData.paymentDetails.invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
   
  const {address} = useAccount();

  const {toast} = useToast();




   useEffect(() => {
    async function fetchUserDetails() {
      if (!address) return;

      try {
        const response = await fetch(`/api/get-user-details?address=${address}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        
        const data = await response.json();
        setSellerDetailsSupabase(data);
      } catch (error: any) {
        console.error('Error fetching user details:', error);
        toast({
          title: 'Error fetching user details',
          description: error.message,
          variant: 'destructive'
        })
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [address]);





  return (
    <div className="w-full max-w-4xl px-4 mx-auto">
      <Card className="border-2">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Invoice</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
            {sellerDetailsSupabase ? (
              <SellerDataFromSupabase 
                name={sellerDetailsSupabase.name}
                email={sellerDetailsSupabase.email}
                evmAddress={sellerDetailsSupabase?.evmAddress}
                zip={sellerDetailsSupabase?.zip}
                country={sellerDetailsSupabase?.country}
                state={sellerDetailsSupabase?.state}
                address={sellerDetailsSupabase?.address}
              />
            ) : (
              <p>loading...</p>
            )}
          
            <div className="mt-4 sm:mt-0"> 
              <h3 className="font-semibold text-lg mb-2">Client:</h3>
              <p>{formData.senderDetails.name}</p>
              <p>{formData.senderDetails.email}</p>
              <p>{formData.senderDetails.address}</p>
              <p>{formData.senderDetails.city} {formData.senderDetails.state} {formData.senderDetails.zip}</p>
              <p>{formData.senderDetails.country}</p>
              <p className="mt-2">EVM Address:</p>
              <p className="font-mono break-all text-xs lg:text-base ">{formData.paymentDetails.receiverAddress}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2">Payment Details:</h3>
            <div className='flex items-center'> 
              <p className='mr-2'>Chain:</p> 
              <Image src={chainInfo[Number(formData.paymentDetails.chain) as ValidChainId].logoUrl} height={24} width={24} alt="chain logo" /> 
            </div>
            <p>Currency: {formData.paymentDetails.currency}</p>
            <p>Stream Type: {formData.streamType}</p>
            <p>Due Date: {formData.paymentDetails.dueDate ? format(formData.paymentDetails.dueDate, 'PP') : 'Not set'}</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.paymentDetails.invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-right">
            <p className="font-semibold">Total Amount: {totalAmount.toFixed(2)} {formData.paymentDetails.currency}</p>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-1 space-y-2 lg:space-y-0 lg:flex lg:justify-between border-t pt-6">
          <Button variant="outline" onClick={() => setStep(2)} className="w-full sm:w-auto">Back</Button>
          {sellerDetailsSupabase ? (
            <CreateRequestButton
              payeeEVMAddress={sellerDetailsSupabase.evmAddress}
              payerEVMAddress={formData.paymentDetails.receiverAddress}
              payeeDetails={sellerDetailsSupabase}
              payerDetails={formData.senderDetails}
              expectedAmount={totalAmount.toString()}
              dueDate={getUnixTime(formData.paymentDetails.dueDate as number)}
              chain={formData.paymentDetails.chain}
              invoiceItems={formData.paymentDetails.invoiceItems}
            
            />
          ) : (
            <Spinner className='h-4 w-4' />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}