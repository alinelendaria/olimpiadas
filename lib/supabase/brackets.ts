import { createClient } from './server';
import type { BracketResult } from '@/lib/data/chaveamentos';

export async function getBracketResults(chaveamentoId: string): Promise<BracketResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bracket_partidas')
      .select('chaveamento_id, fase_id, partida_id, vencedor, status')
      .eq('chaveamento_id', chaveamentoId);

    if (error) return [];
    return (data ?? []) as BracketResult[];
  } catch {
    return [];
  }
}
