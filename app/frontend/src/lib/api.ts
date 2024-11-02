import axios from 'axios';
import { Case, Evidence, Person, Organization } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCases = async (): Promise<Case[]> => {
  const { data } = await api.get('/cases');
  return data;
};

export const getCase = async (id: number): Promise<Case> => {
  const { data } = await api.get(`/case/${id}`);
  return data;
};

export const getEntities = async (caseId: number, type?: string): Promise<{
  people: Person[];
  organizations: Organization[];
}> => {
  const { data } = await api.get(`/case/${caseId}/entities${type ? `?type=${type}` : ''}`);
  return data;
};

export const createCase = async (caseData: Partial<Case>): Promise<Case> => {
  const { data } = await api.post('/case/new', caseData);
  return data;
};

export const updateCase = async (id: number, caseData: Partial<Case>): Promise<Case> => {
  const { data } = await api.post(`/case/${id}/edit`, caseData);
  return data;
};

export const deleteCase = async (id: number): Promise<void> => {
  await api.post(`/case/${id}/delete`);
}; 