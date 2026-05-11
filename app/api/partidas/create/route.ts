import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createClient();

    const { error } = await supabase.from('partidas').insert({
      modalidade:   body.modalidade,
      delegacao_a:  body.delegacaoA,
      jogador_a:    body.jogadorA,
      placar_a:     body.placarA,
      delegacao_b:  body.delegacaoB,
      jogador_b:    body.jogadorB,
      placar_b:     body.placarB,
      status:       body.status,
      mvp:          body.mvp || null,
      data:         body.data,
      link:         body.link || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
