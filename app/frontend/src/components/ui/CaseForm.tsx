import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface CaseFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}

export function CaseForm({ onSubmit, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Case</Button>
      </div>
    </form>
  );
}