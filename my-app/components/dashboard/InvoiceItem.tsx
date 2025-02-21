import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, DollarSignIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';
import StreamStatusDashboard from './StreamStatusDashboard';
import PendingStatusDashboard from './PendingStatusDashboard';
import supabaseUTCToLocalTime from '@/utils/time/supabaseUTCToLocalTime';
import { cn } from "@/lib/utils";
import { parseISO, format, isAfter, isValid } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface InvoiceItemProps {
  invoice: {
    id: string;
    created_at: string;
    payee_evm_address: string;
    payer_evm_address: string;
    expected_amount: string;
    status: string;
    due_date: string;
  };
  copiedAddress: string | null;
  onCopyAddress: (address: string) => void;
  type: 'invoicesSent' | 'invoicesReceived';
  sliceAddress: (address: string) => string;
  requestId: string;
  chainId: ValidChainId;
  stream_id?: number;
}

export const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  copiedAddress,
  onCopyAddress,
  type,
  sliceAddress,
  requestId,
  chainId,
  stream_id
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const updateStreamingStatus = (status: boolean) => {
    setIsStreaming(status);
  };

  const parsedDueDate = parseISO(invoice.due_date);
  const localDueDate = toZonedTime(parsedDueDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const isDueDateValid = isValid(localDueDate);
  const isDueDatePast = isDueDateValid && isAfter(new Date(), localDueDate);
  const isDueDateDestructive = !stream_id && isDueDatePast;

  useEffect(() => {
    const currentDate = new Date();
    console.table({
      'invoice amount': invoice.expected_amount,
      'Due Date (UTC)': invoice.due_date,
      'Due Date (Local)': isDueDateValid ? format(localDueDate, 'yyyy-MM-dd HH:mm:ss') : 'Invalid Date',
      'Is Due Date Valid': isDueDateValid ? 'Yes' : 'No',
      'Current Date': format(currentDate, 'yyyy-MM-dd HH:mm:ss'),
      'Current Date (ISO)': currentDate.toISOString(),
      'Is Past Due': isDueDatePast ? 'Yes' : 'No',
      'Time Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }, [invoice.due_date, invoice.expected_amount, isDueDatePast, localDueDate, isDueDateValid]);

  return (
    <TableRow key={invoice.id} className="hover:bg-primary-foreground">
      <TableCell className={cn(
        isDueDateDestructive && "text-destructive font-semibold"
      )}>
        {supabaseUTCToLocalTime(invoice.due_date)}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{sliceAddress(invoice.payee_evm_address)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopyAddress(invoice.payee_evm_address)}
            className="h-6 w-6"
          >
            {copiedAddress === invoice.payee_evm_address ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{sliceAddress(invoice.payer_evm_address)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopyAddress(invoice.payer_evm_address)}
            className="h-6 w-6"
          >
            {copiedAddress === invoice.payer_evm_address ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Image src={chainInfo[chainId].logoUrl} alt="chain logo" width={24} height={24} className='flex justify-center' />
      </TableCell>
      <TableCell className="font-medium">{invoice.expected_amount} USD</TableCell>
      <TableCell>
        {stream_id ? <StreamStatusDashboard stream_id={stream_id} chainId={chainId} setIsStreaming={updateStreamingStatus} /> : <PendingStatusDashboard isDueDateDestructive={isDueDateDestructive} />}
      </TableCell>
      <TableCell>
        {
          isStreaming === true ?
          <Link href={`/invoice/${requestId}`}>
            <Button size="sm" className="flex items-center space-x-1">
              <DollarSignIcon className="h-5 w-5" />
              <span>View Stream</span>
            </Button>
          </Link>
          :
          <Link href={type === 'invoicesReceived' && !stream_id ? `/pay-invoice/${requestId}` : `/invoice/${requestId}`}>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>View Invoice</span>
            </Button>
          </Link>
        }
      </TableCell>
    </TableRow>
  );
};