const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);

export function checkFileType(file: File) {
  return ALLOWED_TYPES.has(file.type);
}

export function checkFileSize(file: File) {
  return file.size <= 1024 * 1024 * 2;
}
