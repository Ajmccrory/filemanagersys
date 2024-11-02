import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCases, createCase, deleteCase } from '@/lib/api';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { format } from 'date-fns';

export default function Home() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', description: '' });

  const { data: cases, isLoading } = useQuery(['cases'], getCases);

  const createMutation = useMutation(createCase, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cases']);
      setIsCreating(false);
      setNewCase({ title: '', description: '' });
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
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Add Case
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="mt-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newCase.title}
              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <textarea
              placeholder="Description"
              value={newCase.description}
              onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              onClick={() => createMutation.mutate(newCase)}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cases?.map((case_) => (
                  <tr key={case_.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <Link href={`/case/${case_.id}`}>{case_.title}</Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(case_.created_at), 'PP')}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => deleteMutation.mutate(case_.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
} 