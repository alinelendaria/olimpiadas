import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/bet/admin';

export const dynamic = 'force-dynamic';

// GET — lista todos os eventos com opções
export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bet_events')
      .select('*, bet_options!bet_options_event_id_fkey(*)')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ events: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST — cria novo evento (admin)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const { titulo, descricao, encerra_em, opcoes } = await req.json() as {
      titulo: string;
      descricao?: string;
      encerra_em?: string;
      opcoes: { texto: string; odd: number }[];
    };

    if (!titulo || !opcoes?.length) {
      return NextResponse.json({ error: 'Título e opções são obrigatórios' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: event, error: evErr } = await supabase
      .from('bet_events')
      .insert({ titulo, descricao: descricao ?? null, encerra_em: encerra_em ?? null, created_by: admin.id })
      .select()
      .single();

    if (evErr) return NextResponse.json({ error: evErr.message }, { status: 500 });

    const { error: optErr } = await supabase
      .from('bet_options')
      .insert(opcoes.map(o => ({ event_id: event.id, texto: o.texto, odd: o.odd })));

    if (optErr) return NextResponse.json({ error: optErr.message }, { status: 500 });

    const { data: full } = await supabase
      .from('bet_events')
      .select('*, bet_options!bet_options_event_id_fkey(*)')
      .eq('id', event.id)
      .single();

    return NextResponse.json({ event: full }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
