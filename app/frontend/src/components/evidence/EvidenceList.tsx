'use client';

import { useEvidence } from '@/lib/hooks/useEvidence';
import { EvidenceCard } from './EvidenceCard';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

interface EvidenceListProps {
  caseId: number;
}

export function EvidenceList({ caseId }: EvidenceListProps) {
  const { data: evidence, isLoading, error } = useEvidence(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        Failed to load evidence: {error.message}
      </Alert>
    );
  }

  if (!evidence?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No evidence found. Add evidence using the form above.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {evidence.map((item) => (
        <EvidenceCard key={item.id} evidence={item} />
      ))}
    </div>
  );
}