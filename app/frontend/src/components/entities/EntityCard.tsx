'use client';

import { useState } from 'react';
import { Entity } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EditEntityForm } from './EditEntityForm';
import { useDeleteEntity } from '@/lib/hooks/useEntities';
import { toast } from 'react-hot-toast';

interface EntityCardProps {
  entity: Entity;
  showRelationControls?: boolean;
  evidenceId?: number;
  onEdit?: () => void;
}

export function EntityCard({ 
  entity, 
 /* showRelationControls,
  evidenceId,
  onEdit */
}: EntityCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const deleteEntity = useDeleteEntity();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entity?')) return;

    try {
      await deleteEntity.mutateAsync(entity.id);
      toast.success('Entity deleted successfully');
    } catch (error) {
      console.error('Error in EntityCard:', error)
      toast.error('Failed to delete entity');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold">{entity.name}</h3>
      
      <div className="mt-2 text-gray-600 dark:text-gray-300">
        Type: {entity.type}
        {entity.type === 'person' && entity.role && (
          <span className="ml-2">Role: {entity.role}</span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          loading={deleteEntity.isPending}
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Entity"
      >
        <EditEntityForm
          entity={entity}
          onSuccess={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
}