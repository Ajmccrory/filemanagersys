import { api } from '@/lib/utils/api-client';
import { Case } from '@/lib/types';

export const casesApi = {
  getAll: () => api.get<Case[]>('/cases'),
  
  getById: (id: number) => api.get<Case>(`/cases/${id}`),
  
  create: async (formData: FormData) => {
    const response = await api.post<Case>('/cases/new', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  
  update: async (id: number, formData: FormData) => {
    const response = await api.put<Case>(`/cases/${id}/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  
  delete: (id: number) => api.delete(`/cases/${id}`),
};