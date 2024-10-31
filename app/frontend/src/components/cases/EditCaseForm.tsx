'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Case } from '@/lib/types';
import { useUpdateCase } from '@/lib/hooks/useCases';
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
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.file?.[0]) {
        formData.append('file', data.file[0]);
      }

      await updateCase.mutateAsync({
        id: case_.id,
        formData,
      });
      
      toast.success('Case updated successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to update case');
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
          placeholder="Case Description"
          rows={3}
        />
      </div>

      <div>
        <Input
          type="file"
          {...register('file')}
          accept=".pdf,.doc,.docx,.txt"
        />
        {case_.file_path && (
          <p className="mt-1 text-sm text-gray-500">
            Current file: {case_.file_path}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}