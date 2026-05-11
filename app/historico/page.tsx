import Image from 'next/image';
import { DELEGACOES } from '@/lib/data/delegacoes';

const TIMELINE = [
  { date: 'Maio 2024',   icon: '📢', title: 'Anúncio das Olimpíadas TDJ',    desc: 'A ideia de criar um evento olímpico para a comunidade TDJ Haxball foi anunciada. A empolgação foi imediata.' },
  { date: 'Junho 2024',  icon: '🌍', title: 'Formação das Delegações',        desc: 'Nove delegações foram formadas representando diferentes países. Cada delegação escolheu seus atletas.' },
  { date: 'Julho 2024',  icon: '⚔️', title: 'Início das Competições',          desc: 'As primeiras partidas começaram! Modalidades X1, X2, X3 e Shootout entraram em andamento.' },
  { date: 'Agosto 2024', icon: '🏆', title: 'Grande Final',                   desc: 'Cerimônia de encerramento e finais de todas as modalidades programadas para agosto de 2024.' },
];

export default function HistoricoPage() {
  const totalPlayers = DELEGACOES.reduce((sum, d) => sum + d.jogadores.length, 0);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
          <p className="text-gray-500 mt-1">A história das Olimpíadas TDJ Haxball</p>
        </div>

        {/* Edition badge */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-center gap-4 mb-10">
          <span className="text-4xl">🥇</span>
          <div>
            <p className="text-lg font-bold text-amber-900">1ª Edição — Olimpíadas TDJ Haxball</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {DELEGACOES.length} delegações · {totalPlayers} atletas · 7 modalidades · 2024
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-card mb-10 text-gray-600 text-sm leading-relaxed">
          Esta é a <strong className="text-gray-900">1ª edição</strong> das Olimpíadas TDJ Haxball —
          um evento histórico para a comunidade, reunindo{' '}
          <strong className="text-gray-900">{DELEGACOES.length} delegações</strong>,{' '}
          <strong className="text-gray-900">{totalPlayers} atletas</strong> e{' '}
          <strong className="text-gray-900">7 modalidades</strong> únicas.
          Mais história será feita aqui conforme o torneio avança.
        </div>

        {/* Timeline */}
        <h2 className="text-base font-semibold text-gray-700 mb-6">Linha do Tempo</h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-6 pl-14">
            {TIMELINE.map((event, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.45rem] top-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs">
                  {event.icon}
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-card">
                  <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">{event.date}</p>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delegations grid */}
        <div className="mt-12">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Delegações da 1ª Edição</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DELEGACOES.map((d) => (
              <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-card">
                <Image
                  src={d.flagUrl}
                  alt={d.nome}
                  width={32}
                  height={22}
                  className="flag-img w-8 h-[22px] shrink-0"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.nome}</p>
                  <p className="text-xs text-gray-400">{d.jogadores.length} atletas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future */}
        <div className="mt-10 bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
          <p className="text-3xl mb-3">🚀</p>
          <h3 className="text-base font-bold text-gray-900 mb-2">O Futuro é Agora</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            A história está sendo escrita. Cada partida, cada medalha e cada MVP será lembrado
            pelas gerações futuras da comunidade TDJ Haxball.
          </p>
        </div>
      </div>
    </div>
  );
}
