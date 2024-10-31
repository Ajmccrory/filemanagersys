'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateEntity } from '@/lib/hooks/useEntities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';
import { Entity } from '@/lib/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['person', 'organization']),
  role: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditEntityFormProps {
  entity: Entity;
  onSuccess?: () => void;
}

export function EditEntityForm({ entity, onSuccess }: EditEntityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateEntity = useUpdateEntity();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name,
      type: entity.type,
      role: entity.role,
    },
  });

  const entityType = watch('type');

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateEntity.mutateAsync({
        entityId: entity.id,
        ...data,
      });
      toast.success('Entity updated successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error in EditEntityForm', error)
      toast.error('Failed to update entity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Select
          {...register('type')}
          label="Entity Type"
          options={[
            { value: 'person', label: 'Person' },
            { value: 'organization', label: 'Organization' },
          ]}
        />
      </div>

      <div>
        <Input
          {...register('name')}
          placeholder={entityType === 'person' ? "Person's Name" : "Organization's Name"}
          error={errors.name?.message}
        />
      </div>

      {entityType === 'person' && (
        <div>
          <Input
            {...register('role')}
            placeholder="Role (optional)"
          />
        </div>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        Save Changes
      </Button>
    </form>
  );
}