import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chaveamento_id, fase_id, partida_id, vencedor, placar1, placar2 } = body as {
      chaveamento_id: string;
      fase_id: string;
      partida_id: number;
      vencedor: 1 | 2 | null;
      placar1?: number | null;
      placar2?: number | null;
    };

    const supabase = createClient();

    if (vencedor === null) {
      const { error } = await supabase
        .from('bracket_partidas')
        .delete()
        .eq('chaveamento_id', chaveamento_id)
        .eq('fase_id', fase_id)
        .eq('partida_id', partida_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase
        .from('bracket_partidas')
        .upsert({
          chaveamento_id,
          fase_id,
          partida_id,
          vencedor,
          placar1: placar1 ?? null,
          placar2: placar2 ?? null,
          status: 'finalizado',
        });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
