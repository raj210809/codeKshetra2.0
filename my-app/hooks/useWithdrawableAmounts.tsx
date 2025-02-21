import { useReadContracts } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
import { contracts, ValidChainId } from '@/utils/contracts/contracts';

const contractAbi = parseAbiItem('function withdrawableAmountOf(uint256 streamId) view returns (uint128 withdrawableAmount)')

export function useWithdrawableAmounts(streams: { stream_id: number; chain_id: number }[]) {
  const { data, isError, isLoading } = useReadContracts({
    contracts: streams.map((stream) => ({
      address: contracts[stream.chain_id as ValidChainId].sablierLinearV2LockUpAddress as `0x${string}`,
      abi: [contractAbi],
      functionName: 'withdrawableAmountOf',
      args: [BigInt(stream.stream_id)],
      chainId: stream.chain_id,
    })),
  })

  const withdrawableAmounts = data?.map((result, index) => ({
    amount: result.status === 'success' 
      ? parseFloat(formatUnits(result.result as bigint, 18)) // Assuming 18 decimals, adjust if different
      : null,
    chainId: streams[index].chain_id
  }))

  return { withdrawableAmounts, isError, isLoading }
}