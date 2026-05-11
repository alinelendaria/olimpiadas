import Link from 'next/link';
import { DELEGACOES, getAllPlayers } from '@/lib/data/delegacoes';
import { PARTIDAS } from '@/lib/data/partidas';
import { MODALIDADES } from '@/lib/data/modalidades';
import { Plus, Trophy, Users, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
  const totalPlayers  = getAllPlayers().length;
  const liveMatches   = PARTIDAS.filter((p) => p.status === 'live').length;
  const finishedCount = PARTIDAS.filter((p) => p.status === 'finished').length;

  const stats = [
    { label: 'Delegações',  value: DELEGACOES.length, color: 'text-blue-600 bg-blue-50' },
    { label: 'Atletas',     value: totalPlayers,       color: 'text-purple-600 bg-purple-50' },
    { label: 'Modalidades', value: MODALIDADES.length, color: 'text-green-600 bg-green-50' },
    { label: 'Partidas',    value: PARTIDAS.length,    color: 'text-amber-600 bg-amber-50' },
    { label: 'Ao Vivo',     value: liveMatches,        color: 'text-red-600 bg-red-50' },
    { label: 'Finalizadas', value: finishedCount,      color: 'text-gray-600 bg-gray-100' },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-card">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${s.color}`}>
              <BarChart2 className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {[
          { href: '/admin/partidas',  Icon: Plus,   label: 'Adicionar Partida',  desc: 'Registre uma nova partida' },
          { href: '/admin/medalhas',  Icon: Trophy, label: 'Atribuir Medalha',   desc: 'Distribua medalhas aos vencedores' },
          { href: '/admin/jogadores', Icon: Users,  label: 'Gerenciar Atletas',  desc: 'Adicione ou edite atletas' },
        ].map(({ href, Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-card-hover transition-all group shadow-card"
          >
            <div className="w-9 h-9 bg-accent-light rounded-lg flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5 group-hover:text-accent transition-colors">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Atividade Recente</h2>
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
        {PARTIDAS.slice(0, 5).map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  match.status === 'live' ? 'bg-red-500 animate-pulse' :
                  match.status === 'finished' ? 'bg-green-500' : 'bg-blue-400'
                }`}
              />
              <span className="text-sm text-gray-700">
                {match.equipaA.jogador} vs {match.equipaB.jogador}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{match.modalidade}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  match.status === 'live' ? 'text-red-600 bg-red-50' :
                  match.status === 'finished' ? 'text-green-700 bg-green-50' : 'text-blue-600 bg-blue-50'
                }`}
              >
                {match.status === 'live' ? 'Ao Vivo' : match.status === 'finished' ? 'Finalizado' : 'Agendado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
