'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCases, createCase, deleteCase } from '@/lib/api';
import { useState } from 'react';
import Layout from '@/components/Layout';
import { CaseList } from '@/components/CaseList';
import { CaseForm } from '@/components/CaseForm';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: cases, isLoading } = useQuery(['cases'], getCases);

  const createMutation = useMutation(createCase, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cases']);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation(deleteCase, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cases']);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Cases</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsCreating(true)}>
            Add Case
          </Button>
        </div>
      </div>

      {isCreating && (
        <div className="mt-4">
          <CaseForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      <CaseList
        cases={cases || []}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </Layout>
  );
}