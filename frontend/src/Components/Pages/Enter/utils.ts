export function saveFileToSessionStorage(file: File, key: string) {
  if (!file || !file.name) return;
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result,
      };
      sessionStorage.setItem(key, JSON.stringify(fileData));
    } else {
      console.error('Failed to read file');
    }
  };

  reader.readAsDataURL(file);
}

export async function getFileFromSessionStorage(key: string) {
  const saved = sessionStorage.getItem(key);
  if (!saved) return null;

  const fileData = JSON.parse(saved);

  const response = await fetch(fileData.data);
  const blob = await response.blob();

  return new File([blob], fileData.name, { type: fileData.type });
}

export function base64ToFile(base64String: string, filename: string): File {
  // Извлекаем MIME-тип и данные
  const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Invalid base64 string format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Конвертируем base64 в бинарные данные
  const binaryString = atob(base64Data);

  // Создаем ArrayBuffer напрямую
  const bytes = new ArrayBuffer(binaryString.length);
  const view = new Uint8Array(bytes);

  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  // Используем ArrayBuffer напрямую
  return new File([bytes], filename, { type: mimeType });
}

export function resetFormFromStorage() {
  sessionStorage.removeItem('enter');
  sessionStorage.removeItem('passportPhoto');
}
