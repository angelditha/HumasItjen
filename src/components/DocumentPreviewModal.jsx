import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  dataUrlToBlob,
  detectDocumentKind,
  downloadDocument,
  isDocumentAvailable
} from '../utils/documentHelper';

export default function DocumentPreviewModal({ docItem, onClose }) {
  const [objectUrl, setObjectUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const rawUrl = docItem?.fileUrl || docItem?.url || '';
  const hasFile = isDocumentAvailable(rawUrl);
  const kind = detectDocumentKind(rawUrl);

  useEffect(() => {
    if (!hasFile) {
      setObjectUrl('');
      return;
    }

    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('data:')) {
      const blob = dataUrlToBlob(trimmed);
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setObjectUrl(trimmed);
    return undefined;
  }, [rawUrl, hasFile]);

  if (!docItem) return null;

  const title = docItem.title || docItem.judul || docItem.tentang || docItem.nomor || 'Dokumen Resmi';
  const subtitle = docItem.subtitle || (docItem.jenis ? `${docItem.jenis} ${docItem.nomor || ''}`.trim() : docItem.kode || '');
  const metaSize = docItem.ukuranFile || docItem.fileSize || '';
  const metaDate = docItem.tanggalDitetapkan || docItem.periode || '';

  const isPublicHttpOffice =
    kind === 'office' && /^https?:\/\//i.test(rawUrl.trim());
  const officeViewerUrl = isPublicHttpOffice
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(rawUrl.trim())}`
    : '';

  const handleDownload = async () => {
    if (!hasFile) return;
    setDownloading(true);
    try {
      await downloadDocument(rawUrl, docItem.downloadName || subtitle || title);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#063a69] text-white px-4 sm:px-6 py-3.5 border-b-2 border-[#fbae17] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-[#fbae17]/20 border border-[#fbae17]/40 text-[#fbae17] flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {subtitle && (
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-[#fbae17] text-[#063a69] px-2 py-0.5 rounded">
                    {subtitle}
                  </span>
                )}
                {metaDate && (
                  <span className="text-[11px] text-slate-300 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-[#fbae17]" />
                    <span>{metaDate}</span>
                  </span>
                )}
                {metaSize && (
                  <span className="text-[11px] text-slate-300">&bull; {metaSize}</span>
                )}
              </div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate mt-1">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {hasFile && objectUrl && (
              <a
                href={objectUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                title="Buka dokumen pada tab browser baru tanpa mengunduh"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#fbae17]" />
                <span className="hidden sm:inline">Buka di Tab Baru</span>
              </a>
            )}

            {hasFile && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="px-3.5 py-2 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Mengunduh...' : 'Unduh'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 bg-slate-100 overflow-auto flex flex-col">
          {!hasFile && (
            <div className="m-auto max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#d48f05] flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-base text-[#063a69]">
                  File Dokumen Belum Diunggah
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dokumen digital untuk <strong>{subtitle || title}</strong> belum dilampirkan oleh administrator. Silakan hubungi pengelola Humas Itjen Kemendagri atau unggah salinan resmi melalui Portal Admin.
                </p>
              </div>
            </div>
          )}

          {hasFile && kind === 'pdf' && objectUrl && (
            <>
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>Anda sedang membaca dokumen secara langsung tanpa mengunduh file ke perangkat.</span>
                </span>
                <a
                  href={objectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#063a69] underline flex items-center space-x-1"
                >
                  <span>Buka Tampilan Penuh di Browser</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe
                src={objectUrl}
                title={title}
                className="w-full flex-1 bg-white border-0"
              />
            </>
          )}

          {hasFile && kind === 'image' && objectUrl && (
            <div className="p-6 m-auto max-w-4xl">
              <img
                src={objectUrl}
                alt={title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-md border border-slate-300 bg-white mx-auto"
              />
            </div>
          )}

          {hasFile && kind === 'office' && officeViewerUrl && (
            <iframe
              src={officeViewerUrl}
              title={title}
              className="w-full flex-1 bg-white border-0"
            />
          )}

          {hasFile && ((kind === 'office' && !officeViewerUrl) || kind === 'external' || kind === 'text' || kind === 'binary') && (
            <div className="w-full flex-1 flex flex-col">
              {(kind === 'external' || kind === 'text') && objectUrl ? (
                <>
                  <div className="bg-slate-200 px-4 py-2 text-[11px] text-slate-700 flex items-center justify-between">
                    <span>Jika halaman dokumen eksternal tidak tampil di dalam bingkai ini, klik tombol Buka di Tab Baru di pojok kanan atas.</span>
                    <a
                      href={objectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#063a69] underline"
                    >
                      Buka di Tab Baru
                    </a>
                  </div>
                  <iframe
                    src={objectUrl}
                    title={title}
                    className="w-full flex-1 bg-white border-0"
                  />
                </>
              ) : (
                <div className="m-auto max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#063a69] flex items-center justify-center mx-auto border border-blue-200">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#063a69]">
                    Dokumen Siap Dibuka atau Diunduh
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Format dokumen ini (Word/Excel/Presentasi) tidak dapat dirender langsung di jendela browser bawaan. Gunakan tombol di bawah untuk membuka atau mengunduh salinan resminya.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={objectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#063a69] rounded-lg text-xs font-bold flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka di Tab Baru</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-4 py-2 bg-[#063a69] hover:bg-[#042646] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#fbae17]" />
                      <span>Unduh File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
