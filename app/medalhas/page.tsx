import MedalTable from '@/components/medalhas/MedalTable';

export default function MedalhasPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quadro de Medalhas</h1>
          <p className="text-gray-500 mt-1">
            Classificação geral por país. Clique nos cabeçalhos para ordenar.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-200 inline-block" />
            1º lugar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
            2º lugar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-50 border border-yellow-100 inline-block" />
            3º lugar
          </span>
          <span className="text-gray-300">·</span>
          <span>Pontos: Ouro=3 · Prata=2 · Bronze=1</span>
        </div>

        <MedalTable />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-center">
          O quadro é atualizado após cada partida finalizada.
        </div>
      </div>
    </div>
  );
}
