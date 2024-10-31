'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCase } from '@/lib/hooks/useCases';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  file: z.instanceof(FileList).optional(),
});

type FormData = z.infer<typeof schema>;

export function NewCaseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCase = useCreateCase();

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
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.file?.[0]) {
        formData.append('file', data.file[0]);
      }

      await createCase.mutateAsync(formData);
      toast.success('Case created successfully');
      reset();
    } catch (error) {
      console.error('Error in NewCaseForm:', error)
      toast.error('Failed to create case');
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
        Create Case
      </Button>
    </form>
  );
}