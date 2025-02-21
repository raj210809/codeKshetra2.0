import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { IInvoiceData } from '@/types/interfaces';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';

export async function POST(req: NextRequest) {
  const invoiceData: IInvoiceData = await req.json();

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  // Define colors for a more professional look
  const backgroundColor = '#ffffff';
  const textColor = '#333333';
  const accentColor = '#00b496';
  const warningColor = '#e74c3c';
  const borderColor = '#e0e0e0';

  // Set background color
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgroundColor);

  // Add a header with a colored bar
  doc.rect(0, 0, doc.page.width, 15).fill(accentColor);

  // Add title with a more professional font and styling
  doc.font('Helvetica-Bold')
     .fontSize(28)
     .fillColor(textColor)
     .text('INVOICE', 50, 50, { align: 'center' });

  // Add invoice number and date
  doc.fontSize(10)
     .font('Helvetica')
     .text(`Date: ${formatDate(new Date().getTime())}`, 50, 105, { align: 'right' });

  // Add warning if past due with improved styling
  const currentDate = new Date();
  const dueDate = new Date(invoiceData.paymentDetails.dueDate);
  if (currentDate > dueDate) {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor(warningColor)
       .text('PAST DUE', 50, 130, { align: 'center' })
       .rect(200, 125, 200, 25).stroke(warningColor);
  }

  // Add seller and client information with improved layout
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(textColor);
  const infoY = 160;
  addInformation(doc, 'From:', invoiceData.partiesDetails.seller, invoiceData.paymentDetails.payeeAddress, 50, infoY);
  addInformation(doc, 'To:', invoiceData.partiesDetails.client, invoiceData.paymentDetails.payerAddress, 300, infoY);
  
  // Add subtle border around seller and client information
  doc.rect(40, infoY - 10, 515, 200).lineWidth(0.5).stroke(borderColor);

  // Add payment details with improved styling
  const paymentY = 380;
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Payment Details', 50, paymentY);
  
  doc.fontSize(10)
     .font('Helvetica');
  addDetailRow(doc, 'Chain:', chainInfo[invoiceData.paymentDetails.chain as ValidChainId].name, 50, paymentY + 25);
  addDetailRow(doc, 'Currency:', invoiceData.paymentDetails.currency, 50, paymentY + 45);
  addDetailRow(doc, 'Stream Type:', invoiceData.paymentDetails.streamType, 50, paymentY + 65);
  addDetailRow(doc, 'Due Date:', formatDate(invoiceData.paymentDetails.dueDate as any), 50, paymentY + 85);

  // Add subtle border around payment details
  doc.rect(40, paymentY - 10, 515, 120).lineWidth(0.5).stroke(borderColor);

  // Add invoice items with improved table styling
  const itemsY = 520;
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Invoice Items', 50, itemsY);

  const tableTop = itemsY + 25;
  generateTable(doc, invoiceData.paymentDetails.invoiceItems, tableTop, borderColor, accentColor);

  // Add total amount with improved styling
  const totalTop = tableTop + (invoiceData.paymentDetails.invoiceItems.length + 1) * 30 + 20;
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('black')
     .text(`Total Amount: ${invoiceData.paymentDetails.totalAmount} USDC`, 50, totalTop, { align: 'right' });



  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks as any));
    });
  });

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    },
  });
}

function addInformation(doc: PDFKit.PDFDocument, title: string, data: any, evmAddress: string, x: number, y: number) {
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text(title, x, y);
  doc.fontSize(10)
     .font('Helvetica')
     .text(data.name, x, y + 20)
     .text(data.email, x, y + 35)
     .text(data.address || '', x, y + 50)
     .text(`${data.city || ''}, ${data.state || ''} ${data.zip || ''}`, x, y + 65)
     .text(data.country || '', x, y + 80)
     .text('EVM Address:', x, y + 95)
     .text(evmAddress, x, y + 110, { width: 200, align: 'left' });
}

function addDetailRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number) {
  doc.font('Helvetica-Bold').text(label, x, y)
     .font('Helvetica').text(value, x + 100, y);
}

function generateTable(doc: PDFKit.PDFDocument, items: any[], y: number, borderColor: string, headerColor: string) {
  const headers = ['Item', 'Quantity', 'Price', 'Total'];
  const columnWidth = 128;
  
  doc.fontSize(10).font('Helvetica-Bold');

  // Draw table header with colored background
  doc.rect(50, y, 515, 25).fill(headerColor);
  headers.forEach((header, i) => {
    doc.fillColor('#ffffff').text(header, 55 + i * columnWidth, y + 8);
  });

  // Draw table rows
  doc.font('Helvetica').fillColor('black');
  items.forEach((item, i) => {
    const rowY = y + 25 + (i * 25);
    doc.rect(50, rowY, 515, 25).lineWidth(0.5).stroke(borderColor);
    doc.text(item.name, 55, rowY + 8)
       .text(item.quantity.toString(), 55 + columnWidth, rowY + 8)
       .text(item.price.toFixed(2), 55 + 2 * columnWidth, rowY + 8)
       .text((item.quantity * item.price).toFixed(2), 55 + 3 * columnWidth, rowY + 8);
  });
}

function formatDate(timestamp: number | string): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}