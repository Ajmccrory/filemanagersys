import { api } from '@/lib/utils/api-client';
import { Evidence } from '@/lib/types';

export const evidenceApi = {
  getAll: (caseId: number) => 
    api.get<Evidence[]>(`/cases/${caseId}/evidence`),

  getById: (evidenceId: number) => 
    api.get<Evidence>(`/evidence/${evidenceId}`),

  create: (caseId: number, data: {
    title: string;
    description?: string;
  }) => api.post<Evidence>(`/cases/${caseId}/evidence`, data),

  update: (evidenceId: number, data: {
    title?: string;
    description?: string;
  }) => api.put<Evidence>(`/evidence/${evidenceId}`, data),

  delete: (evidenceId: number) => 
    api.delete(`/evidence/${evidenceId}`),
};