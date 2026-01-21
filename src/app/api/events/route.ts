import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

interface EventRequest {
  eventType: string;
  metadata?: Record<string, unknown>;
  mixtapeId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventRequest = await request.json();
    const { eventType, metadata = {}, mixtapeId } = body;

    // Validate eventType is required
    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Get userId from cookies (optional)
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value || null;

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert event
    await supabase.from('events').insert({
      event_type: eventType,
      metadata,
      mixtape_id: mixtapeId || null,
      user_id: userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
