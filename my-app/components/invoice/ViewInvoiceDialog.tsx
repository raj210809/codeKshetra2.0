import React from 'react'
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import InvoiceContent from './InvoiceContent'
import { IInvoiceData } from '@/types/interfaces'
import { EyeIcon, File } from 'lucide-react'
import DownloadPDF from './DownloadPDF'

interface InvoiceContentProps {
    invoiceData: IInvoiceData;
    isFromActionButtons?: boolean
}

const ViewInvoiceDialog = ({ invoiceData, isFromActionButtons }: InvoiceContentProps) => {



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-[100%]' variant={isFromActionButtons ? 'outline' : 'default'}><File className="mr-2 h-4 w-4" /> View Invoice</Button>
            </DialogTrigger>
            <DialogContent className="w-[100%] lg:w-full lg:max-w-4xl max-h-[90vh] overflow-y-auto">

                <InvoiceContent invoiceData={invoiceData} />
                <DownloadPDF invoiceData={invoiceData} />
            </DialogContent>
        </Dialog>)
}

export default ViewInvoiceDialog