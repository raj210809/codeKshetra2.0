import InvoiceCreatedEmail from '@/components/email/InvoiceCreatedEmail';
import { format } from 'date-fns';
import { Resend } from 'resend';

const resend = new Resend('re_PvKjzZUf_2AaJWxUJzpG4kRQ7Q3akJCN4');

type InvoiceCreatedEmailParams = {
  firstName: string;
  seller: string;
  amount: string;
  dueDate: any;
  receiverEmail: string;
  link: string;
}

export async function POST(request: Request) {
  try {
    const { firstName, seller, amount, dueDate, receiverEmail, link }: InvoiceCreatedEmailParams = await request.json();

    console.log('Received email data:', { firstName, seller, amount, dueDate, receiverEmail, link });

    const formattedDueDate = format(dueDate * 1000, 'PP');

    if (!firstName || !seller || !amount || !dueDate || !link) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(receiverEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Streambill@info.streambill.xyz',
      to: [receiverEmail],
      subject: '📄 You received an invoice',
      react: InvoiceCreatedEmail({ firstName, seller, amount, formattedDueDate, link }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}