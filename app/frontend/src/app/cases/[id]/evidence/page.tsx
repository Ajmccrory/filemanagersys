import { EvidenceList } from '@/components/evidence/EvidenceList';
import { NewEvidenceForm } from '@/components/evidence/NewEvidenceForm';

interface EvidencePageProps {
  params: {
    id: string;
  };
}

export default function EvidencePage({ params }: EvidencePageProps) {
  const caseId = parseInt(params.id);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Evidence</h2>
        <NewEvidenceForm caseId={caseId} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Evidence List</h2>
        <EvidenceList caseId={caseId} />
      </div>
    </div>
  );
}