import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bracket_partidas')
      .select('chaveamento_id, fase_id, partida_id, vencedor, status')
      .eq('chaveamento_id', params.id);

    if (error) return NextResponse.json({ results: [] });
    return NextResponse.json({ results: data ?? [] });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
