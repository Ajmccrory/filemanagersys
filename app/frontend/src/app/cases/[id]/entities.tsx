import { EntityList } from '@/components/entities/EntityList';
import { NewEntityForm } from '@/components/entities/NewEntityForm';

interface EntitiesPageProps {
  params: {
    id: string;
  };
}

export default function EntitiesPage({ params }: EntitiesPageProps) {
  const caseId = parseInt(params.id);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Entity</h2>
        <NewEntityForm caseId={caseId} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Entities</h2>
        <EntityList caseId={caseId} />
      </div>
    </div>
  );
}