export function displayImage(file: File) {
  const imageUrl = URL.createObjectURL(file);
  return imageUrl;
}

export function downloadFile(file: File, customFilename?: string) {
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;
  link.download = customFilename || file.name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
