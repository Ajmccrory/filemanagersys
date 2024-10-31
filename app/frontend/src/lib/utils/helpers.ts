export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const fileToFormData = (file: File): FormData => {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  };
  
  export const handleApiError = (error: any): string => {
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };
  
  export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };