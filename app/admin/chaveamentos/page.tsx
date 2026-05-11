import Link from 'next/link';
import { CHAVEAMENTOS } from '@/lib/data/chaveamentos';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  aguardando:   'text-blue-600 bg-blue-50',
  em_andamento: 'text-red-600 bg-red-50',
  finalizado:   'text-green-700 bg-green-50',
};

export default function AdminChaveamentosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Chaveamentos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie resultados das partidas</p>
      </div>

      <div className="flex flex-col gap-3">
        {CHAVEAMENTOS.map((c) => (
          <Link
            key={c.id}
            href={`/admin/chaveamentos/${c.id}`}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <span className="text-3xl">{c.icone}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{c.nome}</p>
              <p className="text-sm text-gray-500">{c.totalParticipantes} participantes</p>
            </div>
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                STATUS_STYLE[c.status] ?? STATUS_STYLE.aguardando
              )}
            >
              {c.status.replace('_', ' ')}
            </span>
            <span className="text-gray-300 text-lg">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
