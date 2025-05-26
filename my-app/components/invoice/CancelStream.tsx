import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { XCircle, Loader2 } from 'lucide-react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { contracts, ValidChainId } from '@/utils/contracts/contracts'
import { abi } from '../../abi/SablierLinear'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { chainInfo } from '@/utils/multi-chain/MultiChainSelectOptions'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


type CancelStreamProps = {
  streamId: number,
  chain_id: number,
  wasCanceled?: boolean
  isFromGig?: boolean
}

const CancelStream = ({
  streamId,
  chain_id,
  wasCanceled,
  isFromGig
}: CancelStreamProps) => {
  const router = useRouter()
  const { toast } = useToast();
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

  function cancelStream() {
    const sablierLinearV2LockUpAddress = contracts[chain_id as ValidChainId]?.sablierLinearV2LockUpAddress
     if(chainId !== chain_id) {
      toast({
        title: `You are on the wrong chain, switch to ${chainInfo[chain_id as ValidChainId].name}`,
        variant: "destructive"
      })
     } else {
    writeContract({
      address: sablierLinearV2LockUpAddress,
      abi,
      functionName: 'cancel',
      args: [
        streamId
      ],
      chainId: chain_id
    })
  }
  }

  useEffect(() => {
    if (error) {
      console.error('Contract write error');
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive"
      })
    }
  }, [error, toast])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: `Stream canceled : ${streamId}`,

        variant: "default"
      })
     router.push('/dashboard')
    }

  }, [isConfirmed])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className={isFromGig ? 'w-auto' :  `w-full`}
          disabled={isPending || isConfirming || wasCanceled}
        >
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" /> Cancel Stream & return funds
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isConfirming ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <DialogDescription>
              Confirming cancellation...
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Cancel Stream</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-4">
              <DialogDescription className="text-center text-xl text-primary">
                Are you sure you want to cancel the stream?
              </DialogDescription>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">No, keep it</Button>
              </DialogClose>
              <Button variant="destructive" onClick={cancelStream}>Yes, cancel it</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CancelStream