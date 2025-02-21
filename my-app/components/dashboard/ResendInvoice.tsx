'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CalendarIcon, RotateCwIcon } from 'lucide-react'
import { IInvoiceData, UserDetailsFromSupabase } from '@/types/interfaces'
import { format, isBefore, startOfTomorrow, addDays, getUnixTime } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import CreateRequestButton from '../create-invoice/CreateRequestButton'

interface ResendInvoiceProps {
    invoiceData: IInvoiceData;
}

export default function ResendInvoice({ invoiceData }: ResendInvoiceProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newDueDate, setNewDueDate] = useState<Date | undefined>(invoiceData.paymentDetails.dueDate as Date)
    const [newAmount, setNewAmount] = useState(invoiceData.paymentDetails.totalAmount)
    const [payeeDetails, setPayeeDetails] = useState<UserDetailsFromSupabase & {evmAddress: string}>(
    {
        evmAddress: invoiceData.paymentDetails.payeeAddress,
        name: invoiceData.partiesDetails.seller.name,
        email: invoiceData.partiesDetails.seller.email,
        address: invoiceData.partiesDetails.seller.address,
        city: invoiceData.partiesDetails.seller.city,
        state: invoiceData.partiesDetails.seller.state,
        zip: invoiceData.partiesDetails.seller.zip,
        country: invoiceData.partiesDetails.seller.country
    }
    )

    const handleResend = () => {
        // Here you would implement the logic to resend the invoice
        console.log('Resending invoice with new due date:', newDueDate, 'and new amount:', newAmount)
        setIsDialogOpen(false)
    }

    const disablePastDates = (date: Date) => {
        return isBefore(date, startOfTomorrow());
      };

      useEffect(() => {
      console.log(newDueDate)
      }, [newDueDate])

      React.useEffect(() => {
        const tomorrow = startOfTomorrow();
        if (!newDueDate || isBefore(newDueDate, tomorrow)) {
          setNewDueDate(tomorrow);
        }
      }, []);
    

    return (
        <>
            <Button
                size="sm"
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                onClick={() => setIsDialogOpen(true)}
            >
                <RotateCwIcon className="mr-2 h-4 w-4" />
                <span>Resend Invoice</span>
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Resend Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col space-y-1.5 mt-4">
                            <Label htmlFor="dueDate">Due Date<span className="text-red-600">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !newDueDate && "text-muted-foreground"
                                        )}
                                    >
                                        {newDueDate ? (
                                            format(newDueDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={newDueDate}
                                        onSelect={setNewDueDate}
                                        disabled={disablePastDates}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                
                    </div>
                    <DialogFooter>
                        <CreateRequestButton
                        payeeEVMAddress={invoiceData.paymentDetails.payeeAddress}
                        payerEVMAddress={invoiceData.paymentDetails.payerAddress}
                        payeeDetails={payeeDetails}
                        payerDetails={invoiceData.partiesDetails.seller as any}
                        chain={invoiceData.paymentDetails.chain.toString()}
                        invoiceItems={invoiceData.paymentDetails.invoiceItems}
                        dueDate={getUnixTime(newDueDate as Date)}
                        expectedAmount={invoiceData.paymentDetails.totalAmount.toString()}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}