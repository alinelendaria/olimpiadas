import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const { event_id, option_id, valor } = await req.json() as {
      event_id: string; option_id: string; valor: number;
    };
    if (!event_id || !option_id || !valor || valor < 1) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Perfil do usuário
    const { data: profile } = await supabase
      .from('bet_users')
      .select('saldo, total_apostado')
      .eq('id', user.id)
      .single();
    if (!profile) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
    if (profile.saldo < valor) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });

    // Evento aberto
    const { data: event } = await supabase
      .from('bet_events')
      .select('id, status')
      .eq('id', event_id)
      .eq('status', 'aberta')
      .single();
    if (!event) return NextResponse.json({ error: 'Aposta não disponível' }, { status: 400 });

    // Opção válida
    const { data: option } = await supabase
      .from('bet_options')
      .select('odd')
      .eq('id', option_id)
      .eq('event_id', event_id)
      .single();
    if (!option) return NextResponse.json({ error: 'Opção inválida' }, { status: 400 });

    const retorno_possivel = Math.floor(valor * Number(option.odd));

    // Debita saldo
    const { error: updateErr } = await supabase
      .from('bet_users')
      .update({
        saldo:          profile.saldo - valor,
        total_apostado: profile.total_apostado + valor,
      })
      .eq('id', user.id);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    // Registra aposta
    const { data: bet, error: betErr } = await supabase
      .from('bet_bets')
      .insert({ user_id: user.id, event_id, option_id, valor, retorno_possivel })
      .select()
      .single();
    if (betErr) {
      // Rollback saldo
      await supabase
        .from('bet_users')
        .update({ saldo: profile.saldo, total_apostado: profile.total_apostado })
        .eq('id', user.id);
      return NextResponse.json({ error: betErr.message }, { status: 500 });
    }

    const { data: updatedProfile } = await supabase
      .from('bet_users').select('*').eq('id', user.id).single();

    return NextResponse.json({ success: true, bet, profile: updatedProfile });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
