import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getDelegacaoById } from '@/lib/data/delegacoes';
import { cn } from '@/lib/utils';

type Partida = {
  id: string;
  modalidade: string;
  delegacao_a: string;
  jogador_a: string;
  placar_a: number;
  delegacao_b: string;
  jogador_b: string;
  placar_b: number;
  status: 'scheduled' | 'live' | 'finished';
  mvp: string | null;
  link: string | null;
  data: string;
};

async function getPartidas(): Promise<Partida[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('partidas')
      .select('*')
      .order('data', { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

function StatusBadge({ status }: { status: Partida['status'] }) {
  if (status === 'live') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
        <span className="live-dot" /> Ao Vivo
      </span>
    );
  }
  if (status === 'finished') {
    return <span className="text-xs text-gray-400">Finalizado</span>;
  }
  return <span className="text-xs text-blue-500">Agendado</span>;
}

function PartidaCard({ p }: { p: Partida }) {
  const delegA = getDelegacaoById(p.delegacao_a);
  const delegB = getDelegacaoById(p.delegacao_b);
  const winA = p.status === 'finished' && p.placar_a > p.placar_b;
  const winB = p.status === 'finished' && p.placar_b > p.placar_a;

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 font-medium">{p.modalidade}</span>
        <StatusBadge status={p.status} />
      </div>

      {/* Players + score */}
      <div className="flex items-center gap-3">
        {/* Player A */}
        <div className={cn('flex-1 flex items-center gap-2', winB && 'opacity-40')}>
          {delegA && (
            <Image src={delegA.flagUrl} alt={delegA.nome} width={24} height={16} unoptimized className="flag-img shrink-0" />
          )}
          <span className={cn('text-sm truncate', winA ? 'font-bold text-gray-900' : 'text-gray-700')}>
            {p.jogador_a}
          </span>
        </div>

        {/* Score */}
        <div className="text-center shrink-0">
          {p.status === 'finished' ? (
            <span className="text-base font-bold text-gray-900 tabular-nums">
              {p.placar_a} × {p.placar_b}
            </span>
          ) : (
            <span className="text-xs text-gray-300">×</span>
          )}
        </div>

        {/* Player B */}
        <div className={cn('flex-1 flex items-center gap-2 justify-end', winA && 'opacity-40')}>
          <span className={cn('text-sm truncate text-right', winB ? 'font-bold text-gray-900' : 'text-gray-700')}>
            {p.jogador_b}
          </span>
          {delegB && (
            <Image src={delegB.flagUrl} alt={delegB.nome} width={24} height={16} unoptimized className="flag-img shrink-0" />
          )}
        </div>
      </div>

      {/* Footer */}
      {(p.mvp || p.link) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
          {p.mvp && (
            <span className="text-xs text-amber-600">⭐ MVP: {p.mvp}</span>
          )}
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline ml-auto">
              Ver replay →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function PartidasPage() {
  const partidas = await getPartidas();

  const live      = partidas.filter((p) => p.status === 'live');
  const finished  = partidas.filter((p) => p.status === 'finished');
  const scheduled = partidas.filter((p) => p.status === 'scheduled');

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partidas</h1>
          <p className="text-gray-500 mt-1">{partidas.length} partidas registradas</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-8">
          {live.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full font-medium">
              <span className="live-dot" /> {live.length} ao vivo
            </span>
          )}
          <span className="text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full font-medium">
            {finished.length} finalizadas
          </span>
          <span className="text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
            {scheduled.length} agendadas
          </span>
        </div>

        {partidas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">Nenhuma partida registrada ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Use o Admin → Registrar Partida para adicionar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {live.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <span className="live-dot" /> Ao Vivo
                </h2>
                {live.map((p) => <PartidaCard key={p.id} p={p} />)}
              </>
            )}
            {finished.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mt-4">Finalizadas</h2>
                {finished.map((p) => <PartidaCard key={p.id} p={p} />)}
              </>
            )}
            {scheduled.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-500 mt-4">Agendadas</h2>
                {scheduled.map((p) => <PartidaCard key={p.id} p={p} />)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
