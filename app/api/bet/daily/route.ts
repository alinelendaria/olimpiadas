import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const { data, error } = await supabase.rpc('claim_daily_reward', { p_user_id: user.id });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!data.success) {
      return NextResponse.json(
        { error: 'cooldown', next_reward: data.next_reward },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from('bet_users').select('*').eq('id', user.id).single();

    return NextResponse.json({ success: true, profile, next_reward: data.next_reward });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
