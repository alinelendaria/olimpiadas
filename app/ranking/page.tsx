import PlayerRankingTable from '@/components/ranking/PlayerRankingTable';

export default function RankingPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ranking de Jogadores</h1>
          <p className="text-gray-500 mt-1">
            Estatísticas individuais de todos os atletas participantes
          </p>
        </div>
        <PlayerRankingTable />
      </div>
    </div>
  );
}
