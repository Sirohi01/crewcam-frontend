export const toFileUrl = (url?: string | null) => {
  if (!url) return '';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(url)) {
    return `${apiBase}/hiring/pdf-view?url=${encodeURIComponent(url)}`;
  }
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBase.replace('/api/v1', '')}${url}`;
};

export const openFileUrl = (url?: string | null) => {
  const resolved = toFileUrl(url);
  if (resolved) window.open(resolved, '_blank');
};
