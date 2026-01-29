import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EventType } from '@/lib/supabase/types';

// Allowed event types for validation
const ALLOWED_EVENT_TYPES: EventType[] = [
  'page_view',
  'apple_music_connected',
  'track_added',
  'track_removed',
  'mixtape_created',
  'share_clicked',
  'mixtape_viewed',
  'track_played',
  'cta_clicked',
  'error_occurred',
  'newsletter_signup',
];

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

    // Validate eventType is in allowed list
    if (!ALLOWED_EVENT_TYPES.includes(eventType as EventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

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
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
