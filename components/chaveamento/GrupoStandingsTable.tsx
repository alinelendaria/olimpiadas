import Image from 'next/image';
import type { BracketFase } from '@/types';

interface TeamStats {
  nome: string;
  delegacao: string;
  j: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
  pts: number;
}

export default function GrupoStandingsTable({ fase }: { fase: BracketFase }) {
  if (!fase.equipes) return null;

  // ── Participants-only mode (no head-to-head matches, e.g. poker tables) ──
  if (fase.partidas.length === 0) {
    return (
      <div className="mb-5 overflow-x-auto rounded-lg border border-gray-100 shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="py-2 pl-3 pr-2 text-left font-medium w-6">#</th>
              <th className="py-2 pr-3 text-left font-medium">Participante</th>
              <th className="py-2 pl-2 pr-3 text-center font-medium">Situação</th>
            </tr>
          </thead>
          <tbody>
            {fase.equipes.map((eq, i) => (
              <tr key={eq.nome} className="border-t border-gray-100">
                <td className="py-2 pl-3 pr-2 text-xs font-medium text-gray-400">{i + 1}</td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={`https://flagcdn.com/w40/${eq.delegacao}.png`}
                      alt={eq.delegacao}
                      width={18} height={12}
                      unoptimized
                      className="flag-img shrink-0"
                    />
                    <span className="text-gray-800 text-xs truncate max-w-[160px]">{eq.nome}</span>
                  </div>
                </td>
                <td className="py-2 pl-2 pr-3 text-center">
                  <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                    Aguardando
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const stats: Record<string, TeamStats> = {};
  for (const eq of fase.equipes) {
    stats[eq.nome] = { ...eq, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, pts: 0 };
  }

  for (const p of fase.partidas) {
    if (p.status !== 'finalizado' || !p.jogador1 || !p.jogador2) continue;
    const t1 = stats[p.jogador1.nome];
    const t2 = stats[p.jogador2.nome];
    if (!t1 || !t2) continue;

    t1.j++; t2.j++;
    t1.gp += p.placar1 ?? 0; t1.gc += p.placar2 ?? 0;
    t2.gp += p.placar2 ?? 0; t2.gc += p.placar1 ?? 0;

    if (p.vencedor === 1)      { t1.v++; t2.d++; }
    else if (p.vencedor === 2) { t2.v++; t1.d++; }
    else                       { t1.e++; t2.e++; }
  }

  const sorted = Object.values(stats)
    .map((s) => ({ ...s, sg: s.gp - s.gc, pts: s.v * 3 + s.e }))
    .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gp - a.gp);

  const ADVANCE = fase.advanceCount ?? 2;

  return (
    <div className="mb-5 overflow-x-auto rounded-lg border border-gray-100 shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <th className="py-2 pl-3 pr-2 text-left font-medium w-6">#</th>
            <th className="py-2 pr-3 text-left font-medium">Equipe</th>
            <th className="py-2 px-2 text-center font-medium">J</th>
            <th className="py-2 px-2 text-center font-medium">V</th>
            <th className="py-2 px-2 text-center font-medium">E</th>
            <th className="py-2 px-2 text-center font-medium">D</th>
            <th className="py-2 px-2 text-center font-medium">GP</th>
            <th className="py-2 px-2 text-center font-medium">GC</th>
            <th className="py-2 px-2 text-center font-medium">SG</th>
            <th className="py-2 pl-2 pr-3 text-center font-semibold text-gray-600">PTS</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, i) => {
            const isAdvancing = i < ADVANCE;
            return (
              <tr
                key={team.nome}
                className={
                  'border-t border-gray-100 ' +
                  (isAdvancing ? 'bg-green-50/40' : '')
                }
              >
                <td className="py-2 pl-3 pr-2 text-xs font-medium text-gray-400">{i + 1}</td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={`https://flagcdn.com/w40/${team.delegacao}.png`}
                      alt={team.delegacao}
                      width={18}
                      height={12}
                      unoptimized
                      className="flag-img shrink-0"
                    />
                    <span className="text-gray-800 text-xs truncate max-w-[160px]">{team.nome}</span>
                    {isAdvancing && (
                      <span className="text-[9px] text-green-600 font-semibold bg-green-100 px-1 py-0.5 rounded shrink-0">
                        AVANÇA
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-2 text-center text-gray-600">{team.j}</td>
                <td className="py-2 px-2 text-center text-green-600 font-medium">{team.v}</td>
                <td className="py-2 px-2 text-center text-gray-400">{team.e}</td>
                <td className="py-2 px-2 text-center text-red-400">{team.d}</td>
                <td className="py-2 px-2 text-center text-gray-600">{team.gp}</td>
                <td className="py-2 px-2 text-center text-gray-600">{team.gc}</td>
                <td className="py-2 px-2 text-center text-gray-500">
                  {team.sg > 0 ? `+${team.sg}` : team.sg}
                </td>
                <td className="py-2 pl-2 pr-3 text-center font-bold text-gray-900">{team.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
