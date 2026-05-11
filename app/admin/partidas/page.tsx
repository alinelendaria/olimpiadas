import MatchForm from '@/components/admin/MatchForm';

export default function AdminPartidasPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Registrar Partida</h1>
      <p className="text-sm text-gray-400 mb-8">
        Adicione uma nova partida ao sistema. Preencha todos os campos obrigatórios.
      </p>
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-card">
        <MatchForm />
      </div>
    </div>
  );
}
