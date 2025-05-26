"use client";
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { parseEther, decodeEventLog } from 'viem';
import Spinner from '../helpers/Spinner';
import { useToast } from '../ui/use-toast';
import { getTimeRemainingInSeconds } from '@/utils/sablier/getTimeToStreamInSeconds';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions';
import PingAnimation from '../helpers/PingAnimation';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';


type StartLinearStreamProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    amountToStream: string;
    payeeAddress: string;
    dueDate: number;
    requestId: string;
    chain_id: number;
    payerAddress: string;
}

const StartLinearStream = ({ setStep, amountToStream, payeeAddress, dueDate, requestId, chain_id, payerAddress }: StartLinearStreamProps) => {
    const { toast } = useToast();
    const [streamId, setStreamId] = useState<string | null>(null);
    const [isAddingStreamId, setIsAddingStreamId] = useState(false);
    const [addStreamIdError, setAddStreamIdError] = useState<string | null>(null);
    const [isWaitingForStreamId, setIsWaitingForStreamId] = useState(false);

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { address, chainId } = useAccount();

    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } =
        useWaitForTransactionReceipt({
            hash,
        })

    const StartStreaming = useCallback(() => {
        const sablierLinearV2LockUpAddress = contracts[chain_id as ValidChainId]?.sablierLinearV2LockUpAddress
        const tUSDCAddress = contracts[chain_id as ValidChainId]?.tUSDCAddress

      
        if (chainId === chain_id) {
             if(address === payerAddress) {
            writeContract({
                address: sablierLinearV2LockUpAddress,
                abi,
                functionName: 'createWithDurations',
                args: [
                    [
                        address,
                        payeeAddress,
                        parseEther(amountToStream),
                        tUSDCAddress,
                        true,
                        false,
                        [parseEther('0'), getTimeRemainingInSeconds(dueDate)],
                        ['0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f', 0]
                    ]
                ],
                chainId:chain_id
            })
            } else {
                toast({
                    title: `You are not the payer of this invoice`,
                    variant: "destructive"
                })
            }
        } else {
            toast({
                title: `You are on the wrong chain, switch to ${chainInfo[chain_id as ValidChainId].name}`,
                variant: "destructive"
            })
        }
    }, [writeContract, address, payeeAddress, amountToStream, dueDate, chainId, toast]);

    const getStreamIdAndAddToInvoice = useCallback(async (transactionHash: string) => {
        setIsWaitingForStreamId(true);
        try {
            console.log('Preparing to call API...');
            console.log('Transaction Hash:', transactionHash);
            console.log('Chain ID:', chainId);
            console.log('Request ID:', requestId);

            const apiUrl = '/api/get-stream-id';
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionHash,
                    chainId: chainId?.toString(),
                    requestId,
                }),
            });

            console.log('API response status:', response.status);
            const responseText = await response.text();
            console.log('API response text:', responseText);

            if (!response.ok) {
                throw new Error(`Failed to get stream ID and add to invoice: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                alert('Error parsing JSON Response')
                throw new Error('Invalid JSON response from API');
            }

            console.log('Parsed API response:', data);
            return data.streamId;
        } catch (error) {
            console.error('Error in getStreamIdAndAddToInvoice:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to get stream ID and add to invoice",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsWaitingForStreamId(false);
        }
    }, [chainId, requestId, toast]);

    useEffect(() => {
        if (isConfirmed && hash) {
            console.log('Transaction confirmed. Hash:', hash);
            const processTransaction = async () => {
                const streamId = await getStreamIdAndAddToInvoice(hash);
                if (streamId) {
                    setStreamId(streamId);
                    toast({
                        title: "Stream Created",
                        description: `Stream created with ID: ${streamId} and added to invoice`,
                    });
                    setStep(2);
                } else {
                    console.error('Failed to get stream ID');
                    toast({
                        title: "Error",
                        description: "Failed to get stream ID",
                        variant: "destructive"
                    });
                }
            };

            processTransaction();
        }
    }, [isConfirmed, hash, getStreamIdAndAddToInvoice, setStep, toast]);

    useEffect(() => {
        if (error) {
            console.error('Contract write error:', error.message);
            toast({
                title: "Error",
                description: `${error.message}`,
                variant: "destructive"
            })
        }
    }, [error, toast])

    function formatTimeRemaining(seconds: number) {
        const days = Math.floor(seconds / (3600 * 24));
        seconds %= 3600 * 24;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
      
        const parts = [];
        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      
        return parts.join(', ');
      }

      const BeautifulPaymentSummary = () => (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold">{amountToStream}</span>
                        <Image src='/usdc.png' width={36} height={36} alt='USDC LOGO' className='inline-block' />
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">to</p>
                        <p className="text-lg font-medium break-all">{payeeAddress}</p>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">over</p>
                        <p className="text-lg font-semibold">
                            {formatTimeRemaining(getTimeRemainingInSeconds(dueDate))}
                        </p>
                    </div>
                    
                 
                </div>
            </CardContent>
        </Card>
    );

    return (
        <DialogContent className="">
            <DialogHeader>
                <DialogTitle>Start Stream <PingAnimation color="green" size="small" /></DialogTitle>
            </DialogHeader>
            {isConfirming || isWaitingForStreamId ? (
                <div className='flex justify-center'>
                    <Spinner className='w-24 h-24' />
                </div>
            ) : streamId ? (
                <div className="py-4 text-center">
                    <p className="text-lg font-semibold">Stream created with ID: {streamId}</p>
                </div>
            ) : (
              <BeautifulPaymentSummary />
            )}
            <DialogFooter>
                <Button
                    className="w-full"
                    disabled={isPending || isConfirming || isWaitingForStreamId}
                    onClick={StartStreaming}
                >
                    Start Streaming
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default StartLinearStream