'use client';

import { useEntities } from '@/lib/hooks/useEntities';
import { EntityCard } from './EntityCard';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

interface EntityListProps {
  caseId: number;
}


export function EntityList({ caseId: evidenceId }: EntityListProps) {
  const { data: entities, isLoading, error } = useEntities(evidenceId);

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
        Failed to load related entities: {error.message}
      </Alert>
    );
  }

  if (!entities?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No related entities found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {entities.map((entity) => (
        <EntityCard 
          key={entity.id} 
          entity={entity}
          showRelationControls
          evidenceId={evidenceId}
        />
      ))}
    </div>
  );
}