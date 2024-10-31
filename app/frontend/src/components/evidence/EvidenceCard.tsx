'use client';

import { useState } from 'react';
import { Evidence } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EntityList } from '@/components/entities/EntityList'; // Updated import path
import { useDeleteEvidence } from '@/lib/hooks/useEvidence';
import { formatDate } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';

interface EvidenceCardProps {
  evidence: Evidence;
  onEdit?: () => void;
}

export function EvidenceCard({ evidence, onEdit }: EvidenceCardProps) {
  const [showEntities, setShowEntities] = useState(false);
  const deleteEvidence = useDeleteEvidence();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;

    try {
      await deleteEvidence.mutateAsync(evidence.id);
      toast.success('Evidence deleted successfully');
    } catch (error) {
      console.error('Error in Evidence Card:', error)
      toast.error('Failed to delete evidence');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold">{evidence.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {evidence.description}
      </p>
      <div className="mt-2 text-sm text-gray-500">
        Added: {formatDate(evidence.date_added)}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowEntities(true)}
        >
          View Related Entities
        </Button>
        
        {onEdit && (
          <Button
            variant="outline"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          loading={deleteEvidence.isPending}
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showEntities}
        onClose={() => setShowEntities(false)}
        title="Related Entities"
      >
        <EntityList caseId={evidence.id} />
      </Modal>
    </div>
  );
}