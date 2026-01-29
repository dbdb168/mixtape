import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Sanitize string for storage (remove newlines, limit length)
function sanitize(str: string, maxLength: number = 50): string {
  return str.replace(/[\r\n]/g, ' ').trim().slice(0, maxLength);
}

interface UpdateRequest {
  shareToken: string;
  senderName?: string;
  recipientName?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    const { shareToken, senderName, recipientName, message } = body;

    if (!shareToken) {
      return NextResponse.json({ error: 'Share token is required' }, { status: 400 });
    }

    // Validate field lengths
    if (senderName && senderName.length > 50) {
      return NextResponse.json({ error: 'Sender name too long' }, { status: 400 });
    }
    if (recipientName && recipientName.length > 50) {
      return NextResponse.json({ error: 'Recipient name too long' }, { status: 400 });
    }
    if (message && message.length > 200) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, verify the mixtape exists and was created recently (within 24 hours)
    // This prevents modification of old mixtapes
    const { data: mixtape, error: fetchError } = await supabase
      .from('mixtapes')
      .select('id, created_at')
      .eq('share_token', shareToken)
      .single();

    if (fetchError || !mixtape) {
      return NextResponse.json({ error: 'Mixtape not found' }, { status: 404 });
    }

    // Check if mixtape was created within the last 24 hours
    const createdAt = new Date(mixtape.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return NextResponse.json({ error: 'Mixtape can no longer be modified' }, { status: 403 });
    }

    // Build update object
    const updateData: Record<string, string | null> = {};
    if (senderName !== undefined) updateData.sender_name = sanitize(senderName);
    if (recipientName !== undefined) updateData.recipient_name = sanitize(recipientName);
    if (message !== undefined) updateData.message = message ? message.trim().slice(0, 200) : null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true }); // Nothing to update
    }

    const { error: updateError } = await supabase
      .from('mixtapes')
      .update(updateData)
      .eq('share_token', shareToken);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update mixtape' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update mixtape' }, { status: 500 });
  }
}
