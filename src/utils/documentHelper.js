/**
 * Shared helpers for inspecting, previewing, formatting, and downloading official documents.
 */

export function formatFileSize(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) return '';
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${Math.max(1, Math.round(num / 1024))} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

export function isDocumentAvailable(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  return trimmed.length > 0 && trimmed !== '#';
}

export function dataUrlToBlob(dataUrl) {
  const commaIdx = dataUrl.indexOf(',');
  const header = commaIdx !== -1 ? dataUrl.slice(0, commaIdx) : '';
  const body = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : '';
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  if (header.includes(';base64')) {
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

export function detectDocumentKind(rawUrl) {
  if (!isDocumentAvailable(rawUrl)) return 'empty';
  const trimmed = rawUrl.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith('data:application/pdf')) return 'pdf';
  if (lower.startsWith('data:image/')) return 'image';
  if (lower.startsWith('data:text/')) return 'text';
  if (lower.startsWith('data:')) {
    if (lower.includes('wordprocessingml') || lower.includes('msword') || lower.includes('spreadsheetml') || lower.includes('ms-excel') || lower.includes('presentationml') || lower.includes('ms-powerpoint')) {
      return 'office';
    }
    return 'binary';
  }

  const cleanPath = lower.split('?')[0].split('#')[0];
  if (cleanPath.endsWith('.pdf')) return 'pdf';
  if (/\.(png|jpe?g|webp|gif|bmp|svg)$/.test(cleanPath)) return 'image';
  if (/\.(docx?|xlsx?|pptx?)$/.test(cleanPath)) return 'office';
  if (/\.txt$/.test(cleanPath)) return 'text';
  return 'external';
}

export function buildDownloadFilename(rawUrl, title = 'Dokumen-Itjen-Kemendagri') {
  const safeBase = String(title || 'Dokumen-Itjen-Kemendagri')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'Dokumen-Itjen-Kemendagri';

  if (!isDocumentAvailable(rawUrl)) return `${safeBase}.pdf`;
  const trimmed = rawUrl.trim();
  const lower = trimmed.toLowerCase();

  const mimeToExt = {
    'application/pdf': '.pdf',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'text/plain': '.txt'
  };

  if (lower.startsWith('data:')) {
    const mimeMatch = lower.match(/^data:([^;,]+)/);
    const ext = mimeMatch ? (mimeToExt[mimeMatch[1]] || '') : '';
    return safeBase.toLowerCase().endsWith(ext) ? safeBase : `${safeBase}${ext}`;
  }

  const cleanPath = trimmed.split('?')[0].split('#')[0];
  const extMatch = cleanPath.match(/(\.[a-z0-9]{2,5})$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : '.pdf';
  return safeBase.toLowerCase().endsWith(ext) ? safeBase : `${safeBase}${ext}`;
}

export async function downloadDocument(rawUrl, title) {
  if (!isDocumentAvailable(rawUrl)) {
    return { ok: false, reason: 'missing' };
  }

  const filename = buildDownloadFilename(rawUrl, title);
  const trimmed = rawUrl.trim();

  if (trimmed.startsWith('data:')) {
    const blob = dataUrlToBlob(trimmed);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    return { ok: true };
  }

  try {
    const res = await fetch(trimmed);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    return { ok: true };
  } catch {
    const link = document.createElement('a');
    link.href = trimmed;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { ok: true };
  }
}
