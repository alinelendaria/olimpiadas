import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CHAVEAMENTOS, getChaveamentoById, applyResults } from '@/lib/data/chaveamentos';
import { getBracketResults } from '@/lib/supabase/brackets';
import ChaveamentoPageClient from '@/components/chaveamento/ChaveamentoPageClient';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  return CHAVEAMENTOS.map((c) => ({ id: c.id }));
}

const STATUS_LABEL: Record<string, string> = {
  aguardando:   'Aguardando',
  em_andamento: 'Em Andamento',
  finalizado:   'Finalizado',
};
const STATUS_STYLE: Record<string, string> = {
  aguardando:   'text-blue-600 bg-blue-50 border-blue-100',
  em_andamento: 'text-red-600 bg-red-50 border-red-100',
  finalizado:   'text-green-700 bg-green-50 border-green-100',
};

interface PageProps {
  params: { id: string };
}

export default async function ChaveamentoDetailPage({ params }: PageProps) {
  const base = getChaveamentoById(params.id);
  if (!base) notFound();

  const results = await getBracketResults(base.id);
  const chaveamento = applyResults(base, results);

  const fasesAtivas = chaveamento.fases.filter((f) => f.partidas.length > 0 || (f.equipes && f.equipes.length > 0));
  const totalPartidas = fasesAtivas.reduce((acc, f) => acc + f.partidas.length, 0);
  const totalConcluidas = fasesAtivas.reduce(
    (acc, f) => acc + f.partidas.filter((p) => p.status === 'finalizado').length,
    0
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link href="/chaveamentos" className="text-sm text-accent hover:underline mb-8 inline-block">
          ← Chaveamentos
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-card mb-8">
          <div className="flex items-start gap-5">
            <span className="text-5xl shrink-0">{chaveamento.icone}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{chaveamento.nome}</h1>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full border',
                    STATUS_STYLE[chaveamento.status] ?? STATUS_STYLE.aguardando
                  )}
                >
                  {STATUS_LABEL[chaveamento.status]}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{chaveamento.totalParticipantes} participantes</span>
                <span>{totalConcluidas}/{totalPartidas} partidas concluídas</span>
                <span>{fasesAtivas.length} fases</span>
              </div>

              {/* Progress bar */}
              {totalPartidas > 0 && (
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full max-w-xs">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.round((totalConcluidas / totalPartidas) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Champion */}
        {chaveamento.campeao && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center mb-8">
            <p className="text-3xl mb-1">🏆</p>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-0.5">Campeão</p>
            <p className="text-xl font-bold text-amber-900">{chaveamento.campeao}</p>
          </div>
        )}

        {/* Phases — list or tree view (client toggle) */}
        <ChaveamentoPageClient fases={chaveamento.fases} />
      </div>
    </div>
  );
}
