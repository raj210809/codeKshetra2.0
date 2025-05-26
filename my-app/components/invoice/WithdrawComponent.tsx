import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { abi } from '../../abi/SablierLinear';
import { formatEther, parseEther } from 'viem';
import { useToast } from '../ui/use-toast';
import { ArrowDownToLine, CreditCard, Loader2 } from 'lucide-react';
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions';
import PingAnimation from '../helpers/PingAnimation';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

type WithdrawComponentProps = {
    streamId: number;
    chain_id: number;
}

const WithdrawComponent: React.FC<WithdrawComponentProps> = ({ streamId, chain_id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [amountToWithdraw, setAmountToWithdraw] = useState('');
    const [availableToWithdraw, setAvailableToWithdraw] = useState('0');
    const { address } = useAccount();
    const { toast } = useToast();

    const { data: streamData } = useReadContract({
        address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
        abi: abi,
        functionName: 'getStream',
        args: [streamId],
        chainId: chain_id
    });

    const {
        data: withdrawableAmount,
        refetch: refetchWithdrawableAmount
    } = useReadContract({
        address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
        abi: abi,
        functionName: 'withdrawableAmountOf',
        args: [streamId],
        chainId: chain_id
    });

    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    const { chainId } = useAccount();

    useEffect(() => {
        if (withdrawableAmount) {
            setAvailableToWithdraw(formatEther(withdrawableAmount as bigint));
        }
    }, [withdrawableAmount]);

    useEffect(() => {
        if (isOpen) {
            refetchWithdrawableAmount();
        }
    }, [isOpen, refetchWithdrawableAmount]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: `${error.message}`,
                variant: "destructive"
            });
        }
    }, [error, toast]);

    useEffect(() => {
        if (isConfirmed) {
            toast({
                title: "Withdrawal Successful",
                description: `You have successfully withdrawn ${amountToWithdraw} tokens.`,
                variant: "default"
            });
            setIsOpen(false);
            setAmountToWithdraw('');
        }
    }, [isConfirmed, amountToWithdraw]);

    const handleWithdraw = () => {
        if (!address) return;

        const amount = parseEther(amountToWithdraw);
        if (chainId !== chain_id) {
            toast({
                title: `You are on the wrong chain, switch to ${chainInfo[chain_id as ValidChainId].name}`,
                variant: "destructive"
            })
        } else {
            writeContract({
                address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
                abi: abi,
                functionName: 'withdraw',
                args: [streamId, address, amount],
                chainId: chain_id
            });
        }
    };

    const handleMaxClick = () => {
        setAmountToWithdraw(availableToWithdraw);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" /> Withdraw
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Withdraw Funds <PingAnimation color="green" size="small" />
                    </DialogTitle>
                </DialogHeader>
                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="text-center">
                                <label className="text-sm font-medium text-gray-500">Available Balance</label>
                                <div className="text-3xl font-bold flex items-center justify-center mt-2 space-x-2">
                                    <span>{parseFloat(availableToWithdraw).toFixed(4)}</span>
                                    <Image src="/usdc.png" height={36} width={36} alt="USDC logo" />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount to withdraw:
                                </label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="withdrawAmount"
                                        type=""
                                        value={amountToWithdraw}
                                        onChange={(e) => setAmountToWithdraw(e.target.value)}
                                        max={availableToWithdraw}
                                        // step="0.0001"
                                        className="pr-24" // Increased right padding to accommodate the Max button
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleMaxClick}
                                        className="absolute right-0 top-0 bottom-0 px-2 text-sm"
                                        variant="outline"
                                    >
                                        Max
                                    </Button>
                                    <div className="absolute inset-y-0 right-[12.5%] flex items-center pr-3 pointer-events-none">
                                        <Image src="/usdc.png" height={24} width={24} alt="USDC" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleWithdraw}
                                    disabled={isPending || isConfirming || parseFloat(amountToWithdraw) > parseFloat(availableToWithdraw) || parseFloat(amountToWithdraw) <= 0}
                                    className="w-full h-12 text-lg font-semibold"
                                >
                                    {isPending || isConfirming ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirming...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownToLine className="mr-2 h-5 w-5" /> Withdraw
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawComponent;