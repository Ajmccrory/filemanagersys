'use client';

import { useEntities } from '@/lib/hooks/useEntities';
import { EntityCard } from './EntityCard';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

interface EntityListProps {
  caseId: number;
}

export function EntityList({ caseId }: EntityListProps) {
  const { data: entities, isLoading, error } = useEntities(caseId);

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
        Failed to load entities: {error.message}
      </Alert>
    );
  }

  if (!entities?.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No entities found. Add an entity using the form above.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {entities.map((entity) => (
        <EntityCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
}