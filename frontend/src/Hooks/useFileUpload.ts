/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

export interface UseFileUploadResult<T = any> {
  upload: (data: any) => Promise<T>;
  progress: number;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export type UploadFunction<T = any> = (data: any, onProgress?: (progress: number) => void) => Promise<T>;

export interface UploadResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface ProgressEvent {
  loaded: number;
  total: number;
}

export const useFileUpload = <T = any>(uploadFunction: UploadFunction<T>): UseFileUploadResult<T> => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (data: any): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(0);

        const result = await uploadFunction(data, setProgress);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [uploadFunction]
  );

  const reset = useCallback((): void => {
    setProgress(0);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    upload,
    progress,
    isLoading,
    error,
    reset,
  };
};
