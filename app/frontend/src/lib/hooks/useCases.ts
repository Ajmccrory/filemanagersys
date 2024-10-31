import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesApi } from '@/lib/api/cases';
import { Case } from '@/lib/types';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: casesApi.getAll,
  });
}

export function useCase(id: number) {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => casesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: casesApi.create,
    onSuccess: (newCase: Case) => {
      queryClient.setQueryData(['cases'], (old: Case[] = []) => [...old, newCase]);
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      casesApi.update(id, formData),
    onSuccess: (updatedCase: Case) => {
      queryClient.setQueryData(['cases', updatedCase.id], updatedCase);
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

export function useDeleteCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: casesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['cases'], (old: Case[] = []) => 
        old.filter(c => c.id !== deletedId)
      );
    },
  });
}