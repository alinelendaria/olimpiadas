import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();

    // Test 1: can we read events?
    const { data: events, error: evErr } = await supabase
      .from('bet_events')
      .select('id, titulo, status')
      .limit(5);

    // Test 2: can we read options?
    const { data: opts, error: optErr } = await supabase
      .from('bet_options')
      .select('id')
      .limit(1);

    // Test 3: auth
    const { data: { user } } = await supabase.auth.getUser();
    const discordId = user?.identities?.find(i => i.provider === 'discord')?.id;

    return NextResponse.json({
      events_count: events?.length ?? 0,
      events_error: evErr?.message ?? null,
      options_error: optErr?.message ?? null,
      user_id: user?.id ?? null,
      discord_id: discordId ?? null,
      is_admin: discordId === '409098047344345088',
    });
  } catch (err) {
    return NextResponse.json({ fatal: String(err) }, { status: 500 });
  }
}
