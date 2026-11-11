import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  Phone, 
  MapPin, 
  User, 
  Filter, 
  Globe2,
  CheckCircle2,
  Shield
} from 'lucide-react';

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
    const matchesSearch = 
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ibukota?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspektur?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Inspektorat Daerah 38 Provinsi
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Direktori terpadu jejaring Aparat Pengawasan Intern Pemerintah (APIP) daerah di 38 Provinsi seluruh Indonesia. Klik tautan untuk mengakses portal resmi masing-masing Inspektorat Daerah.
        </p>
      </div>

      {/* Ringkasan Metrik Singkat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#063a69]/10 text-[#063a69] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg text-[#063a69]">38 Provinsi</div>
            <div className="text-[11px] text-slate-500">APIP Daerah Terhubung</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#fbae17]/20 text-[#d48f05] flex items-center justify-center font-bold">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg text-[#063a69]">6 Wilayah</div>
            <div className="text-[11px] text-slate-500">Zona Pembinaan Wilayah</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg text-[#063a69]">100% Aktif</div>
            <div className="text-[11px] text-slate-500">Kanal Koordinasi APIP</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg text-[#063a69]">Tersinergi</div>
            <div className="text-[11px] text-slate-500">KPK, BPKP, Kemendagri</div>
          </div>
        </div>
      </div>

      {/* Bar Filter Wilayah & Kotak Pencarian */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Wilayah Pulau */}
        <div className="flex flex-wrap items-center gap-1.5">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                regionFilter === region
                  ? 'bg-[#063a69] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Input Pencarian */}
        <div className="relative min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama provinsi, ibukota, atau inspektur..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69]"
          />
        </div>
      </div>

      {/* Grid 38 Inspektorat Daerah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-xs hover:shadow-lg border border-slate-200 hover:border-[#fbae17] transition-all p-5 flex flex-col justify-between group"
          >
            {/* Atas: Lambang Provinsi & Info Dasar */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {/* Lambang Provinsi Emblem Badge */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#063a69] to-[#042646] text-[#fbae17] p-2 flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform border border-[#fbae17]/30">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#d48f05] uppercase tracking-wider block">
                      Provinsi {item.wilayah}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#063a69] leading-snug group-hover:text-[#0a4f8f]">
                      {item.nama}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.ibukota}
                </span>
              </div>

              {/* Data Pejabat & Kontak */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start space-x-2">
                  <User className="w-3.5 h-3.5 text-[#fbae17] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    Inspektur: <strong className="text-slate-800">{item.inspektur || 'Dalam Pelantikan'}</strong>
                  </span>
                </div>
                {item.telp && (
                  <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{item.telp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bawah: Tombol Link Website Inspektorat Daerah */}
            <div className="pt-4 mt-3 border-t border-slate-100">
              <a
                href={item.website || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 bg-slate-50 hover:bg-[#063a69] text-[#063a69] hover:text-white rounded-lg border border-slate-200 hover:border-[#063a69] text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-2xs group/btn"
              >
                <span>Kunjungi Website Inspektorat</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <p className="font-heading font-bold text-base text-[#063a69]">Tidak Ada Inspektorat Daerah Ditemukan</p>
          <p className="text-xs">Silakan periksa kembali kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
