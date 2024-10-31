'use client';

import { useCases } from '@/lib/hooks/useCases';
import { CaseCard } from './CaseCard';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

export function CaseList() {
  const { data: cases, isLoading, error } = useCases();

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
        Failed to load cases: {error.message}
      </Alert>
    );
  }

  if (!cases?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No cases found. Create your first case to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((case_) => (
        <CaseCard key={case_.id} case_={case_} />
      ))}
    </div>
  );
}