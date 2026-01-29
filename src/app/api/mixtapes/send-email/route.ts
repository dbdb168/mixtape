import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMixtapeEmail } from '@/lib/email';

// Email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize string for email headers (remove newlines, limit length)
function sanitizeForEmail(str: string, maxLength: number = 50): string {
  return str.replace(/[\r\n]/g, ' ').trim().slice(0, maxLength);
}

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

    // Validate required fields
    if (!shareUrl || !senderName || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(recipientEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate field lengths
    if (senderName.length > 50) {
      return NextResponse.json({ error: 'Sender name too long' }, { status: 400 });
    }
    if (recipientName && recipientName.length > 50) {
      return NextResponse.json({ error: 'Recipient name too long' }, { status: 400 });
    }
    if (message && message.length > 200) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // Extract share token from URL
    const shareToken = shareUrl.split('/m/')[1];
    if (!shareToken) {
      return NextResponse.json({ error: 'Invalid share URL' }, { status: 400 });
    }

    // Update mixtape with sender/recipient details
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: mixtape, error: updateError } = await supabase
      .from('mixtapes')
      .update({
        sender_name: sanitizeForEmail(senderName),
        recipient_name: sanitizeForEmail(recipientName || 'Friend'),
        recipient_email: recipientEmail.toLowerCase().trim(),
        message: message ? message.trim().slice(0, 200) : null,
      })
      .eq('share_token', shareToken)
      .select('id')
      .single();

    if (updateError || !mixtape) {
      console.error('Failed to update mixtape:', updateError);
      return NextResponse.json({ error: 'Mixtape not found' }, { status: 404 });
    }

    // Get track count for email
    const { count: trackCount } = await supabase
      .from('tracks')
      .select('*', { count: 'exact', head: true })
      .eq('mixtape_id', mixtape.id);

    const result = await sendMixtapeEmail({
      recipientEmail: recipientEmail.toLowerCase().trim(),
      recipientName: sanitizeForEmail(recipientName || 'Friend'),
      senderName: sanitizeForEmail(senderName),
      mixtapeTitle: sanitizeForEmail(mixtapeTitle || 'A Mixtape'),
      mixtapeUrl: shareUrl,
      message: message?.trim(),
      trackCount: trackCount || 0,
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
