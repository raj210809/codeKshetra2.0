import { abi } from '@/abi/SablierLinear'
import { contracts } from '@/utils/contracts/contracts'
import { ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions'
import React, { useEffect } from 'react'
import { useReadContract } from 'wagmi'

type StreamStatusDashboardProps = {
    stream_id: number,
    chainId: number,
    setIsStreaming: (status: boolean) => void

}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-500';
    case 'STREAMING':
      return 'text-green-500';
    case 'SETTLED':
      return 'text-blue-500';
    case 'CANCELED':
      return 'text-red-500';
      case 'FINISHED':
        return 'text-sky-500';
    default:
      return 'text-gray-500';
  }
};

const StreamStatusDashboard = ({
    stream_id,
    chainId,
    setIsStreaming
}: StreamStatusDashboardProps) => {

    useEffect(() => {
        console.log({
          contract: contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress as `0x${string}`,
          args: stream_id,
          chainId: chainId
        })
      }, [])
    
      const { data: status, isError, isPending, error } = useReadContract({
        address: contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress as `0x${string}`,
        abi: abi,
        functionName: 'statusOf',
        args: [stream_id?.toString()],
        chainId: chainId,
      });
    
    
      useEffect(() => {
        console.log('status of the stream')
        console.log(status)
        console.log(isError)
        console.log(error?.message)
      }, [status, isError])


      // 0 - pending
      // 1 - streaming
      // 2 - settled
      // 3 - canceled
      // 4 - canceled but fully withdrawn
      const statusMap = ['PENDING', 'STREAMING', 'SETTLED', 'CANCELED', 'FINISHED'];
      const statusString = status !== undefined ? statusMap[Number(status)] || 'UNKNOWN' : 'PENDING';

      useEffect(() => {
        if (statusString === 'STREAMING') {
            setIsStreaming(true);
        } else {
            setIsStreaming(false);
        }
    }, [statusString, setIsStreaming]);

  return (
    
    <div className={`font-medium ${getStatusColor(statusString)}`}>
      {statusString}
    </div>
  )
}

export default StreamStatusDashboard