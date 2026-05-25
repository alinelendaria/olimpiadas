import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/bet/admin';

export const dynamic = 'force-dynamic';

// GET — evento com opções + aposta do usuário logado
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();

    const [{ data: event, error }, { data: opts }] = await Promise.all([
      supabase.from('bet_events').select('*').eq('id', params.id).single(),
      supabase.from('bet_options').select('*').eq('event_id', params.id).order('created_at', { ascending: true }),
    ]);

    if (error || !event) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const eventWithOptions = { ...event, bet_options: opts ?? [] };

    const { data: { user } } = await supabase.auth.getUser();
    let userBet = null;
    if (user) {
      const { data } = await supabase
        .from('bet_bets')
        .select('*, bet_options(*)')
        .eq('event_id', params.id)
        .eq('user_id', user.id)
        .single();
      userBet = data ?? null;
    }

    return NextResponse.json({ event: eventWithOptions, userBet });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH — atualiza evento (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const body = await req.json();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bet_events')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ event: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
