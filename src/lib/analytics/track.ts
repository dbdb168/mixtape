import { EventType } from '@/lib/supabase/types';

export async function trackEvent(
  eventType: EventType,
  metadata: Record<string, unknown> = {},
  mixtapeId?: string
): Promise<void> {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        metadata,
        mixtapeId,
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}
