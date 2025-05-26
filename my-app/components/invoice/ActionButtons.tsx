import React, { useEffect } from 'react';
import TokenDisplay from './TokenDisplay';
import { useAccount, useReadContract } from 'wagmi';
import { abi } from '../../abi/SablierLinear'
import { formatEther } from 'viem';
import { StreamData } from '@/types/types';
import CancelStream from './CancelStream';
import ShareInvoiceComponent from './ShareInvoiceComponent';
import WithdrawComponent from './WithdrawComponent';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { IInvoiceData } from '@/types/interfaces';
import ViewInvoiceDialog from './ViewInvoiceDialog';
import StreamForecastDialog from '../stream-forecast/StreamForecastDialog';


type ActionButtonsProps = {
  streamId: number,
  chain_id: number,
  invoiceData: IInvoiceData,
  requestId: string
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  streamId,
  chain_id,
  invoiceData,
  requestId
}) => {
  const { data: streamData, isError, isLoading, error } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getStream',
    args: [streamId],
    chainId: chain_id
  })



  const {address} = useAccount();

  const { data: withdrawnAmount } = useReadContract({
    address: contracts[chain_id as ValidChainId].sablierLinearV2LockUpAddress,
    abi: abi,
    functionName: 'getWithdrawnAmount',
    args: [streamId],
    chainId: chain_id
  })

  useEffect(() => {
    console.log(streamData)
    console.log(error?.message)
  }, [streamData, error])

  const typedStreamData = streamData as StreamData;

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md">
      {streamData  ? (
        <TokenDisplay
          maxValue={Number(formatEther(typedStreamData.amounts.deposited))}
          tokenSymbol="tUSDC"
          startTime={typedStreamData.startTime}
          endTime={typedStreamData.endTime}
          wasCanceled={typedStreamData.wasCanceled}
          refundedAmount={typedStreamData.amounts.refunded}
          withdrawnAmount={withdrawnAmount ? Number(formatEther(withdrawnAmount as bigint)) : 0}
        />
      ) : null}
      {streamData && address === invoiceData.paymentDetails.payeeAddress ? <WithdrawComponent streamId={streamId} chain_id={chain_id} /> : null}
      {streamData && invoiceData.paymentDetails.stream_id ?    <StreamForecastDialog 
        stream_id={invoiceData.paymentDetails.stream_id}
        chain_id={invoiceData.paymentDetails.chain_id}
        triggerText="View Stream Forecast"
      /> : null}
   

      {/* <DownloadPDF invoiceData={invoiceData} /> */}
      <ShareInvoiceComponent requestId={requestId} />
      <ViewInvoiceDialog invoiceData={invoiceData} isFromActionButtons={true} />
      {streamData && address === invoiceData.paymentDetails.payerAddress  ? <CancelStream streamId={streamId} chain_id={chain_id} wasCanceled={typedStreamData.wasCanceled} /> : null}
    </div>
  );
};

export default ActionButtons;