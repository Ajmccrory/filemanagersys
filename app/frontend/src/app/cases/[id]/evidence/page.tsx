import { NewEvidenceForm } from '@/components/evidence/NewEvidenceForm';
import { EvidenceList } from '@/components/evidence/EvidenceList';
import { Metadata } from 'next';

// Import the correct types from Next.js
import PageProps from 'next/types';

// Define the correct params shape that Next.js expects
type EvidencePageProps = PageProps <{
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}>;

export async function generateMetadata(
  { params }: EvidencePageProps
): Promise<Metadata> {
  return {
    title: `Evidence - Case ${params.id}`,
  };
}

export default async function EvidencePage({ params }: EvidencePageProps) {
  const caseId = parseInt(params.id);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Evidence</h2>
        <NewEvidenceForm caseId={caseId} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Evidence</h2>
        <EvidenceList caseId={caseId} />
      </div>
    </div>
  );
}