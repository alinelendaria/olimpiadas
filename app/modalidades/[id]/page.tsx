import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MODALIDADES, getModalidadeById } from '@/lib/data/modalidades';
import { getPartidasByModalidade } from '@/lib/data/partidas';
import { getDelegacaoById } from '@/lib/data/delegacoes';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return MODALIDADES.map((m) => ({ id: m.id }));
}

const STATUS_STYLES: Record<string, string> = {
  em_andamento: 'text-green-700 bg-green-50 border-green-100',
  aguardando:   'text-blue-600 bg-blue-50 border-blue-100',
  finalizado:   'text-gray-500 bg-gray-50 border-gray-100',
};
const STATUS_LABELS: Record<string, string> = {
  em_andamento: 'Em Andamento',
  aguardando:   'Aguardando',
  finalizado:   'Finalizado',
};

export default function ModalidadeDetailPage({ params }: PageProps) {
  const modality = getModalidadeById(params.id);
  if (!modality) notFound();

  const partidas = getPartidasByModalidade(modality.nome.split(' ')[0]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/modalidades" className="text-sm text-accent hover:underline mb-8 inline-block">
          ← Voltar às Modalidades
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-card mb-6">
          <div className="flex items-start gap-5">
            <span className="text-5xl shrink-0">{modality.icone}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{modality.nome}</h1>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[modality.status] ?? STATUS_STYLES.aguardando}`}>
                  {STATUS_LABELS[modality.status] ?? modality.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{modality.descricao}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Formato',          value: modality.formato.replace(/-/g, ' ') },
                  { label: 'Participantes',    value: String(modality.participantes) },
                  { label: 'Máx / Delegação', value: String(modality.maxPorDelegacao) },
                  { label: 'Campeão',          value: modality.campeao ?? 'A definir' },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">{s.label}</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Champion */}
        {modality.campeao && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center mb-6">
            <p className="text-3xl mb-1">🏆</p>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-0.5">Campeão</p>
            <p className="text-lg font-bold text-amber-900">{modality.campeao}</p>
          </div>
        )}

        {/* Matches */}
        <h2 className="text-base font-semibold text-gray-700 mb-4">Partidas desta Modalidade</h2>

        {partidas.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-card">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm text-gray-400">Nenhuma partida registrada ainda para esta modalidade.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {partidas.map((match) => {
              const a = getDelegacaoById(match.equipaA.delegacao);
              const b = getDelegacaoById(match.equipaB.delegacao);
              return (
                <div key={match.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 shadow-card">
                  <div className="flex items-center gap-2 flex-1">
                    {a && <Image src={a.flagUrl} alt={a.nome} width={24} height={16} className="flag-img" unoptimized />}
                    <span className="text-sm font-medium text-gray-800">{match.equipaA.jogador}</span>
                  </div>

                  <div className="text-center shrink-0">
                    {match.status === 'finished' ? (
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {match.equipaA.placar} × {match.equipaB.placar}
                      </span>
                    ) : match.status === 'live' ? (
                      <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                        <span className="live-dot" /> Ao Vivo
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Agendado</span>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(match.data)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-medium text-gray-800">{match.equipaB.jogador}</span>
                    {b && <Image src={b.flagUrl} alt={b.nome} width={24} height={16} className="flag-img" unoptimized />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
