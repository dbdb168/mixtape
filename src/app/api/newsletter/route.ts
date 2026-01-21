import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

interface NewsletterRequest {
  optIn: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Get userId from cookies
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: NewsletterRequest = await request.json();
    const { optIn } = body;

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update users table with newsletter preference
    await supabase
      .from('users')
      .update({ newsletter_opt_in: optIn })
      .eq('id', userId);

    // If user opted in, insert newsletter_signup event
    if (optIn) {
      await supabase.from('events').insert({
        event_type: 'newsletter_signup',
        user_id: userId,
        metadata: {},
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter opt-in error:', error);
    return NextResponse.json(
      { error: 'Failed to update newsletter preference' },
      { status: 500 }
    );
  }
}
