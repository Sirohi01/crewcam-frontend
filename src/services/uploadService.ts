import api from '@/lib/axios';

/**
 * Multipart upload through the backend's /upload (type allow-list, 5 MB, moderation).
 * Returns the stored file's URL. Files must never be embedded as base64 in JSON bodies:
 * the API caps those at 2 MB.
 */
export const uploadFile = async (file: File | Blob, filename = 'upload'): Promise<string> => {
  const form = new FormData();
  form.append('file', file, file instanceof File ? file.name : filename);
  return (await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.url;
};
