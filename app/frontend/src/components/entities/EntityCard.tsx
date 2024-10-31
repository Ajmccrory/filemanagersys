'use client';

import { useState } from 'react';
import { Evidence } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EditEvidenceForm } from './EditEvidenceForm';
import { useDeleteEvidence } from '@/lib/hooks/useEvidence';
import { formatDate } from '@/lib/utils/helpers';

interface EvidenceCardProps {
  evidence: Evidence;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteEvidence = useDeleteEvidence();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this evidence?')) {
      await deleteEvidence.mutateAsync(evidence.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold">{evidence.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {evidence.description}
      </p>
      <div className="mt-4 text-sm text-gray-500">
        Added: {formatDate(evidence.date_added)}
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
          loading={deleteEvidence.isPending}
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Evidence"
      >
        <EditEvidenceForm
          evidence={evidence}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}