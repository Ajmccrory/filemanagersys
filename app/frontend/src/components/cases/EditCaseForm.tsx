'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateCase } from '@/lib/hooks/useCases';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';
import { Case } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  file: z.instanceof(FileList).optional(),
});

type FormData = z.infer<typeof schema>;

interface EditCaseFormProps {
  case_: Case;
  onSuccess?: () => void;
}

export function EditCaseForm({ case_, onSuccess }: EditCaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateCase = useUpdateCase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: case_.title,
      description: case_.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await updateCase.mutateAsync({
        id: case_.id,
        ...data,
      });
      toast.success('Case updated successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update case', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update case');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Case Title"
          error={errors.title?.message}
        />
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Case Description (optional)"
          rows={3}
        />
      </div>

      <div>
        <Input
          type="file"
          {...register('file')}
          accept=".pdf,.doc,.docx,.txt"
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