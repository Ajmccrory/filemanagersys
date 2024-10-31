'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEntity } from '@/lib/hooks/useEntities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['person', 'organization']),
  role: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewEntityFormProps {
  caseId: number;
  onSuccess?: () => void;
}

export function NewEntityForm({ caseId, onSuccess }: NewEntityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEntity = useCreateEntity();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'person',
    },
  });

  const entityType = watch('type');

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await createEntity.mutateAsync({
        caseId,
        ...data,
      });
      toast.success('Entity added successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error in NewEntityform:', error)
      toast.error('Failed to add entity');
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
        Add Entity
      </Button>
    </form>
  );
}