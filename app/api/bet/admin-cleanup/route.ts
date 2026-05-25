import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminUser } from '@/lib/bet/admin';

export const dynamic = 'force-dynamic';

// DELETE — remove todos os eventos cancelados (e suas opções/apostas via CASCADE)
export async function DELETE() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const supabase = createClient();

    const { data, error } = await supabase
      .from('bet_events')
      .delete()
      .eq('status', 'cancelada')
      .select('id, titulo');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ deleted: data?.length ?? 0, events: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
