import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entitiesApi } from '@/lib/api/entities';
import { Entity } from '@/lib/types';

export function useEntities(caseId: number) {
  return useQuery({
    queryKey: ['entities', caseId],
    queryFn: () => entitiesApi.getAll(caseId),
  });
}

export function useEntity(entityId: number) {
  return useQuery({
    queryKey: ['entities', entityId],
    queryFn: () => entitiesApi.getById(entityId),
    enabled: !!entityId,
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, ...data }: Parameters<typeof entitiesApi.create>[1] & { caseId: number }) =>
      entitiesApi.create(caseId, data),
    onSuccess: (newEntity: Entity) => {
      queryClient.invalidateQueries({
        queryKey: ['entities', newEntity.case_id],
      });
    },
  });
}

export function useUpdateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, ...data }: Parameters<typeof entitiesApi.update>[1] & { entityId: number }) =>
      entitiesApi.update(entityId, data),
    onSuccess: (updatedEntity: Entity) => {
      queryClient.invalidateQueries({
        queryKey: ['entities', updatedEntity.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['entities', updatedEntity.case_id],
      });
    },
  });
}

export function useDeleteEntity() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: entitiesApi.delete,
      onSuccess: (_, entityId) => { // Remove unused data parameter
        queryClient.invalidateQueries({
          queryKey: ['entities'],
        });
        // Also invalidate the specific entity
        queryClient.invalidateQueries({
          queryKey: ['entities', entityId],
        });
      },
    });
}