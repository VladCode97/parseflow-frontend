const URL_PATTERN = /^https?:\/\/.+/i;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

export function sanitizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!URL_PATTERN.test(trimmed)) {
    throw new Error('Invalid URL format. Must start with http:// or https://');
  }
  return trimmed;
}

export function validateFileMimeType(mimeType: string): void {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF, PDF`,
    );
  }
}

export function sanitizeFieldValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
