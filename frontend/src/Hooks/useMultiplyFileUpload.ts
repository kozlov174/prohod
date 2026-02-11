/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { UploadFunction } from './useFileUpload';

export interface FileUploadItem<T = any> {
  id: string;
  file: File;
  progress: number;
  isLoading: boolean;
  error: string | null;
  result?: T;
}

export const useMultipleFileUpload = <T = any>(uploadFunction: UploadFunction<T>) => {
  const [uploads, setUploads] = useState<FileUploadItem<T>[]>([]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      const newUploads: FileUploadItem<T>[] = fileArray.map(file => ({
        id: Math.random().toString(36),
        file,
        progress: 0,
        isLoading: true,
        error: null,
      }));

      // Добавляем новые файлы
      setUploads(prev => [...prev, ...newUploads]);

      // Запускаем загрузку для каждого нового файла
      newUploads.forEach(newUpload => {
        const uploadSingleFile = async () => {
          try {
            const formData = new FormData();
            formData.append('file', newUpload.file);

            // Вызываем upload функцию с колбэком прогресса
            const result = await uploadFunction(formData, progress => {
              setUploads(prev => prev.map(u => (u.id === newUpload.id ? { ...u, progress } : u)));
            });

            // Завершаем успешную загрузку
            setUploads(prev =>
              prev.map(u => (u.id === newUpload.id ? { ...u, isLoading: false, progress: 100, result } : u))
            );
          } catch (error) {
            // Обрабатываем ошибку
            setUploads(prev =>
              prev.map(u =>
                u.id === newUpload.id
                  ? {
                      ...u,
                      isLoading: false,
                      error: error instanceof Error ? error.message : 'Upload failed',
                    }
                  : u
              )
            );
          }
        };

        uploadSingleFile();
      });
    },
    [uploadFunction]
  );

  const removeUpload = useCallback((uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  }, []);

  const retryUpload = useCallback(
    async (uploadId: string) => {
      const uploadItem = uploads.find(u => u.id === uploadId);
      if (!uploadItem) return;

      setUploads(prev => prev.map(u => (u.id === uploadId ? { ...u, isLoading: true, error: null, progress: 0 } : u)));

      try {
        const formData = new FormData();
        formData.append('file', uploadItem.file);

        const result = await uploadFunction(formData, progress => {
          setUploads(prev => prev.map(u => (u.id === uploadId ? { ...u, progress } : u)));
        });

        setUploads(prev => prev.map(u => (u.id === uploadId ? { ...u, isLoading: false, progress: 100, result } : u)));
      } catch (error) {
        setUploads(prev =>
          prev.map(u =>
            u.id === uploadId
              ? {
                  ...u,
                  isLoading: false,
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : u
          )
        );
      }
    },
    [uploads, uploadFunction]
  );

  const clearAll = useCallback(() => {
    setUploads([]);
  }, []);

  const isAnyLoading = uploads.some(u => u.isLoading);

  return {
    uploads,
    addFiles,
    removeUpload,
    retryUpload,
    clearAll,
    isAnyLoading,
  };
};
