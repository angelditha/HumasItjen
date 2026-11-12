import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

export default function Inspectorates({ dbData }) {
  const inspectorates = dbData?.inspectorates || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('Semua');

  const regions = [
    'Semua',
    'Sumatera',
    'Jawa',
    'Bali & Nusa Tenggara',
    'Kalimantan',
    'Sulawesi',
    'Maluku & Papua'
  ];

  const filteredList = inspectorates.filter((item) => {
    const matchesRegion = regionFilter === 'Semua' || item.wilayah === regionFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.nama?.toLowerCase().includes(query) ||
      item.wilayah?.toLowerCase().includes(query);
    return matchesRegion && matchesSearch;
  });

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

      {/* Direktori Tautan Inspektorat Daerah (Tanpa Card) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 space-y-6">
        {/* Bar Filter Wilayah & Kotak Pencarian */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                  regionFilter === region
                    ? 'bg-[#063a69] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama provinsi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Daftar 3 Kolom Link Eksternal */}
        {filteredList.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-10">
            {filteredList.map((item) => {
              const href = item.website && item.website.trim() ? item.website : '#';
              const isValidLink = href !== '#';
              return (
                <a
                  key={item.id}
                  href={href}
                  target={isValidLink ? '_blank' : undefined}
                  rel={isValidLink ? 'noopener noreferrer' : undefined}
                  className="break-inside-avoid flex items-center space-x-2.5 py-2.5 border-b border-slate-200/70 text-sm font-medium text-[#063a69] hover:text-[#d48f05] transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 text-[#063a69] group-hover:text-[#d48f05] flex-shrink-0 transition-colors" />
                  <span className="truncate">{item.nama}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-500 space-y-1.5">
            <p className="font-heading font-bold text-base text-[#063a69]">
              Tidak Ada Provinsi Ditemukan
            </p>
            <p className="text-xs">Silakan periksa kembali kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
