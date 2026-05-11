import Link from 'next/link';
import type { Modality } from '@/types';

interface Props {
  modality: Modality;
}

const FORMAT_LABELS: Record<string, string> = {
  'mata-mata':       'Mata-Mata',
  grupos:            'Fase de Grupos',
  'round-robin':     'Todos vs Todos',
  fase_de_grupos:    'Fase de Grupos',
};

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

export default function ModalityCard({ modality }: Props) {
  return (
    <Link href={`/modalidades/${modality.id}`}>
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 h-full flex flex-col gap-4 group">
        {/* Icon + status */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-3xl">{modality.icone}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              STATUS_STYLES[modality.status] ?? STATUS_STYLES.aguardando
            }`}
          >
            {STATUS_LABELS[modality.status] ?? modality.status}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-accent transition-colors leading-snug">
          {modality.nome}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1">{modality.descricao}</p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
          <span>{FORMAT_LABELS[modality.formato] ?? modality.formato}</span>
          <span>{modality.participantes} participantes</span>
        </div>

        {modality.campeao && (
          <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 text-center">
            🏆 Campeão: {modality.campeao}
          </p>
        )}
      </div>
    </Link>
  );
}
