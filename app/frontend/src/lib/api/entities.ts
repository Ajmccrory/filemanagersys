import { api } from '@/lib/utils/api-client';
import { Entity } from '@/lib/types';

export const entitiesApi = {
  getAll: (caseId: number) => 
    api.get<Entity[]>(`/cases/${caseId}/entities`),

  getById: (entityId: number) => 
    api.get<Entity>(`/entities/${entityId}`),

  create: (caseId: number, data: {
    name: string;
    type: 'person' | 'organization';
    role?: string;
  }) => api.post<Entity>(`/cases/${caseId}/entities`, data),

  update: (entityId: number, data: {
    name?: string;
    role?: string;
  }) => api.put<Entity>(`/entities/${entityId}`, data),

  delete: (entityId: number) => 
    api.delete(`/entities/${entityId}`),

  addFact: (entityId: number, content: string) =>
    api.post(`/entities/${entityId}/facts`, { content }),

  deleteFact: (factId: number) =>
    api.delete(`/facts/${factId}`),

  addTag: (entityId: number, name: string) =>
    api.post(`/entities/${entityId}/tags`, { name }),

  deleteTag: (entityId: number, tagId: number) =>
    api.delete(`/entities/${entityId}/tags/${tagId}`),
};