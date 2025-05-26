"use client";
import * as React from 'react'
import {
    type BaseError,
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { abi } from '../../abi/tUSDC'
import { parseEther } from 'viem'
import { Button } from '../ui/button'
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function GetTUSDC() {
    const { toast } = useToast()
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const { address, chainId } = useAccount();

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (chainId && (chainId as ValidChainId) in contracts) {
            writeContract({
                address: contracts[chainId as ValidChainId].tUSDCAddress,
                abi,
                functionName: 'mint',
                args: [address as string, parseEther('10000')],
                chainId: chainId as ValidChainId
            });
        } else {
            console.error('Invalid or unsupported chain ID');
            toast({
                title: "Error",
                description: "Invalid or unsupported chain ID",
                variant: "destructive"
            });
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    React.useEffect(() => {
        if (hash) {
            toast({
                title: "Transaction Submitted",
        
            });
        }
    }, [hash, toast]);

    React.useEffect(() => {
        if (isConfirmed) {
            toast({
                title: "Transaction Confirmed",
                description: "Your tUSDC has been minted successfully.",
            });
        }
    }, [isConfirmed, toast]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Get tUSDC</CardTitle>
                    <CardDescription>Mint 10,000 tUSDC tokens for testing</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <Button
                            disabled={isPending || isConfirming}
                            type="submit"
                            className='w-full'
                        >
                            {isPending || isConfirming ? 'Processing...' : 'Mint 10,000 tUSDC'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    {error && (
                        <p className="text-sm text-red-500">
                            Error: {(error as BaseError).shortMessage || error.message}
                        </p>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}