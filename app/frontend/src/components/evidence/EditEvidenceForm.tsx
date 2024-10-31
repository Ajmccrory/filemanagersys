'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateEvidence } from '@/lib/hooks/useEvidence';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';
import { Evidence } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditEvidenceFormProps {
  evidence: Evidence;
  onSuccess?: () => void;
}

export function EditEvidenceForm({ evidence, onSuccess }: EditEvidenceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateEvidence = useUpdateEvidence();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: evidence.title,
      description: evidence.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateEvidence.mutateAsync({
        evidenceId: evidence.id,
        ...data,
      });
      toast.success('Evidence updated successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error in EditEvidenceForm:', error)
      toast.error('Failed to update evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Evidence Title"
          error={errors.title?.message}
        />
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Evidence Description (optional)"
          rows={3}
        />
      </div>

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