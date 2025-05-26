import StreamStartedEmail from '@/components/email/StreamStartedEmail';
import { format } from 'date-fns';
import { Resend } from 'resend';

const resend = new Resend('re_PvKjzZUf_2AaJWxUJzpG4kRQ7Q3akJCN4'); // Env

type StreamStartedEmail = {
  payerName: string;
  payeeName: string;
  totalAmount: string;
  dueDate: any;
  receiverEmail: string;
  link: string;
}

export async function POST(request: Request) {
  try {
    const { payerName, payeeName, totalAmount, dueDate, receiverEmail, link }: StreamStartedEmail = await request.json();

    console.log('Received email data:', { payerName, payeeName, totalAmount, dueDate, receiverEmail, link });

    const formattedDueDate = format(dueDate, 'PP');

    if (!payerName || !payeeName || !totalAmount || !dueDate || !link) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(receiverEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Streambill@info.streambill.xyz',
      to: [receiverEmail],
      subject: '✅ Stream Started',
      react: StreamStartedEmail({ payerName, payeeName, totalAmount, formattedDueDate, link }),
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