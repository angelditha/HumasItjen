import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Inspectorates({ dbData }) {
  const inspectorates = dbData?.inspectorates || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Koordinasi Pembinaan Pengawasan</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Inspektorat Daerah 38 Provinsi
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Direktori tautan portal resmi Inspektorat Daerah di 38 Provinsi seluruh Indonesia. Klik nama daerah untuk membuka laman eksternal masing-masing Inspektorat Daerah.
        </p>
      </div>

      {/* Daftar Langsung Nama Daerah & Link Eksternal (Tanpa Card, Filter, maupun Pencarian) */}
      {inspectorates.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-x-10">
          {inspectorates.map((item) => {
            const href = item.website && item.website.trim() ? item.website : '#';
            const isValidLink = href !== '#';
            return (
              <a
                key={item.id}
                href={href}
                target={isValidLink ? '_blank' : undefined}
                rel={isValidLink ? 'noopener noreferrer' : undefined}
                className="break-inside-avoid flex items-center space-x-2.5 py-2.5 border-b border-slate-300/70 text-sm font-medium text-[#063a69] hover:text-[#d48f05] transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-[#063a69] group-hover:text-[#d48f05] flex-shrink-0 transition-colors" />
                <span>{item.nama}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 text-xs">
          Belum ada data Inspektorat Daerah tersedia.
        </div>
      )}
    </div>
  );
}
