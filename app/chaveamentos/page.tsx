import Link from 'next/link';
import { CHAVEAMENTOS } from '@/lib/data/chaveamentos';
import { cn } from '@/lib/utils';

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

export default function ChaveamentosPage() {
  const emAndamento = CHAVEAMENTOS.filter((c) => c.status === 'em_andamento');
  const aguardando  = CHAVEAMENTOS.filter((c) => c.status === 'aguardando');
  const finalizados = CHAVEAMENTOS.filter((c) => c.status === 'finalizado');

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chaveamentos</h1>
          <p className="text-gray-500 mt-1">Acompanhe os brackets das modalidades em tempo real</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-8">
          {emAndamento.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full font-medium">
              <span className="live-dot" /> {emAndamento.length} em andamento
            </span>
          )}
          {aguardando.length > 0 && (
            <span className="text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
              {aguardando.length} aguardando
            </span>
          )}
          {finalizados.length > 0 && (
            <span className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full font-medium">
              {finalizados.length} finalizado{finalizados.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Cards */}
        {[...emAndamento, ...aguardando, ...finalizados].map((chaveamento) => (
          <Link
            key={chaveamento.id}
            href={`/chaveamentos/${chaveamento.id}`}
            className="group flex items-center gap-5 bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 mb-3"
          >
            <span className="text-4xl shrink-0">{chaveamento.icone}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">
                  {chaveamento.nome}
                </h2>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full border',
                    STATUS_STYLE[chaveamento.status] ?? STATUS_STYLE.aguardando
                  )}
                >
                  {STATUS_LABEL[chaveamento.status]}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {chaveamento.totalParticipantes} participantes ·{' '}
                {chaveamento.fases.filter((f) => f.partidas.length > 0).length} fases
                {chaveamento.campeao && (
                  <> · <span className="text-amber-600 font-medium">🏆 {chaveamento.campeao}</span></>
                )}
              </p>
            </div>
            <span className="text-gray-300 group-hover:text-accent transition-colors text-lg">→</span>
          </Link>
        ))}

        {CHAVEAMENTOS.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>Nenhum chaveamento cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
