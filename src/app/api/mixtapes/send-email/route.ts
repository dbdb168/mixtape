import { NextRequest, NextResponse } from 'next/server';
import { sendMixtapeEmail } from '@/lib/email';

interface SendEmailRequest {
  shareUrl: string;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  mixtapeTitle: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();

    const { shareUrl, senderName, recipientName, recipientEmail, mixtapeTitle, message } = body;

    if (!shareUrl || !senderName || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract track count from URL or default to unknown
    const trackCount = 0; // We don't have this info here, email template handles it gracefully

    const result = await sendMixtapeEmail({
      recipientEmail,
      recipientName: recipientName || 'Friend',
      senderName,
      mixtapeTitle: mixtapeTitle || 'A Mixtape',
      mixtapeUrl: shareUrl,
      message,
      trackCount,
    });

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
