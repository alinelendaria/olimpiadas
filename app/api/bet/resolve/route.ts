import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/bet/admin';

// POST — resolve evento (admin) ou cancela
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const { event_id, opcao_vencedora_id, cancelar } = await req.json() as {
      event_id: string;
      opcao_vencedora_id?: string;
      cancelar?: boolean;
    };

    if (!event_id) return NextResponse.json({ error: 'event_id obrigatório' }, { status: 400 });

    const supabase = createClient();

    if (cancelar) {
      const { error } = await supabase.rpc('cancel_bet_event', { p_event_id: event_id });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, action: 'cancelado' });
    }

    if (!opcao_vencedora_id) {
      return NextResponse.json({ error: 'opcao_vencedora_id obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('resolve_bet_event', {
      p_event_id:           event_id,
      p_opcao_vencedora_id: opcao_vencedora_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
