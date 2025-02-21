import React, { useState } from 'react'
import { Button } from '../ui/button'
import { DownloadIcon } from 'lucide-react'
import { IInvoiceData } from '@/types/interfaces'

type DownloadPdfProps = {
  invoiceData: IInvoiceData
}

const DownloadPDF = ({ invoiceData }: DownloadPdfProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);



  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
        
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'invoice.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error)
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={isGeneratingPDF}>
      <DownloadIcon className='h-4 w-4 mr-2' />
      {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
    </Button>
  )
}

export default DownloadPDF