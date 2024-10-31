'use client';

import { useState } from 'react';
import { Case } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EditCaseForm } from './EditCaseForm';
import { useDeleteCase } from '@/lib/hooks/useCases';
import Link from 'next/link';

interface CaseCardProps {
  case_: Case;
}

export function CaseCard({ case_ }: CaseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteCaseMutation = useDeleteCase();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this case?')) {
      await deleteCaseMutation.mutateAsync(case_.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link 
        href={`/cases/${case_.id}`}
        className="text-xl font-semibold hover:text-blue-600"
      >
        {case_.title}
      </Link>
      
      <p className="mt-2 text-gray-600">{case_.description}</p>
      
      <div className="mt-4 text-sm text-gray-500">
        Created: {new Date(case_.date_created).toLocaleDateString()}
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          loading={deleteCaseMutation.isPending}
        >
          Delete
        </Button>
        
        {case_.file_path && (
          <Link
            href={`/api/cases/${case_.id}/download`}
            className="text-blue-600 hover:underline"
          >
            Download File
          </Link>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Case"
      >
        <EditCaseForm
          case_={case_}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}