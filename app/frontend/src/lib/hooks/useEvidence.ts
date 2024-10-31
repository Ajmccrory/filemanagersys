import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evidenceApi } from '@/lib/api/evidence';
import { Evidence } from '@/lib/types';

export function useEvidence(caseId: number) {
  return useQuery({
    queryKey: ['evidence', caseId],
    queryFn: () => evidenceApi.getAll(caseId),
  });
}

export function useEvidenceItem(evidenceId: number) {
  return useQuery({
    queryKey: ['evidence', evidenceId],
    queryFn: () => evidenceApi.getById(evidenceId),
    enabled: !!evidenceId,
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evidenceApi.create,
    onSuccess: (newEvidence: Evidence) => {
      queryClient.invalidateQueries({
        queryKey: ['evidence', newEvidence.case_id],
      });
    },
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evidenceApi.update,
    onSuccess: (updatedEvidence: Evidence) => {
      queryClient.invalidateQueries({
        queryKey: ['evidence', updatedEvidence.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['evidence', updatedEvidence.case_id],
      });
    },
  });
}

export function useDeleteEvidence() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: evidenceApi.delete,
      onSuccess: (_, evidenceId) => { // Remove unused data parameter
        queryClient.invalidateQueries({
          queryKey: ['evidence'],
        });
        // Also invalidate the specific evidence
        queryClient.invalidateQueries({
          queryKey: ['evidence', evidenceId],
        });
      },
    });
}