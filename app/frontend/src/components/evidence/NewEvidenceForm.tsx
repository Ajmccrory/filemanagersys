'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEvidence } from '@/lib/hooks/useEvidence';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface NewEvidenceFormProps {
  caseId: number;
  onSuccess?: () => void;
}

export function NewEvidenceForm({ caseId, onSuccess }: NewEvidenceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEvidence = useCreateEvidence();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await createEvidence.mutateAsync({
        caseId,
        ...data,
      });
      toast.success('Evidence added successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add evidence');
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
        Add Evidence
      </Button>
    </form>
  );
}