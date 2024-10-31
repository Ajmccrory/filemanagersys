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
    mutationFn: ({ caseId, ...data }: Parameters<typeof evidenceApi.create>[1] & { caseId: number }) =>
      evidenceApi.create(caseId, data),
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
    mutationFn: ({ evidenceId, ...data }: Parameters<typeof evidenceApi.update>[1] & { evidenceId: number }) =>
      evidenceApi.update(evidenceId, data),
    onSuccess: (updatedEvidence: Evidence) => {
      queryClient.invalidateQueries({
        queryKey: ['evidence', updatedEvidence.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['evidence', updatedEvidence.case