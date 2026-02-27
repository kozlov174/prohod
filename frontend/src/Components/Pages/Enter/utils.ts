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
