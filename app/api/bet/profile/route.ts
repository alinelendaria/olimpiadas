import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const { data: profile } = await supabase
      .from('bet_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) return NextResponse.json({ profile });

    const discordId = user.identities?.find(i => i.provider === 'discord')?.id ?? null;
    const { data: newProfile, error } = await supabase
      .from('bet_users')
      .insert({
        id:         user.id,
        discord_id: discordId,
        username:   user.user_metadata?.full_name ?? user.user_metadata?.name ?? 'Usuário',
        avatar_url: user.user_metadata?.avatar_url ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ profile: newProfile });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
