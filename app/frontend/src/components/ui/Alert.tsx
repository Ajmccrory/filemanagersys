import { cn } from '@/lib/utils/helpers';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function Alert({ 
  children, 
  variant = 'default', 
  className 
}: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        {
          'bg-background text-foreground': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive': 
            variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </div>
  );
}