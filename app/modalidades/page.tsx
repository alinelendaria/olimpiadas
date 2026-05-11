import { MODALIDADES } from '@/lib/data/modalidades';
import ModalityCard from '@/components/modalidades/ModalityCard';

export default function ModalidadesPage() {
  const emAndamento = MODALIDADES.filter((m) => m.status === 'em_andamento');
  const aguardando  = MODALIDADES.filter((m) => m.status === 'aguardando');
  const finalizadas = MODALIDADES.filter((m) => m.status === 'finalizado');

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modalidades</h1>
          <p className="text-gray-500 mt-1">7 modalidades compõem as Olimpíadas TDJ Haxball</p>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-3 mb-8">
          {emAndamento.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full font-medium">
              <span className="live-dot" />
              {emAndamento.length} em andamento
            </span>
          )}
          <span className="text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
            {aguardando.length} aguardando
          </span>
          <span className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full font-medium">
            {finalizadas.length} finalizadas
          </span>
        </div>

        {emAndamento.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="live-dot" /> Em Andamento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emAndamento.map((m) => <ModalityCard key={m.id} modality={m} />)}
            </div>
          </div>
        )}

        {aguardando.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Aguardando Início</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aguardando.map((m) => <ModalityCard key={m.id} modality={m} />)}
            </div>
          </div>
        )}

        {finalizadas.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-4">Finalizadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalizadas.map((m) => <ModalityCard key={m.id} modality={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
