import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  FileCheck2,
  Share2
} from 'lucide-react';

export default function Regulations({ dbData, activeSubPage }) {
  const regulations = dbData?.regulations || [];

  const initialJenis = activeSubPage === 'reg-permendagri'
    ? 'Permendagri'
    : activeSubPage === 'reg-kepmendagri'
    ? 'Kepmendagri'
    : activeSubPage === 'reg-se'
    ? 'SE'
    : 'Semua';

  const [jenisFilter, setJenisFilter] = useState(initialJenis);
  const [tahunFilter, setTahunFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique years
  const availableYears = ['Semua', ...Array.from(new Set(regulations.map(r => r.tahun))).sort().reverse()];

  const filteredRegulations = regulations.filter((reg) => {
    const matchesJenis = jenisFilter === 'Semua' || reg.jenis === jenisFilter;
    const matchesTahun = tahunFilter === 'Semua' || String(reg.tahun) === String(tahunFilter);
    const matchesSearch = 
      reg.nomor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.tentang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(reg.tahun).includes(searchQuery);
    return matchesJenis && matchesTahun && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Jaringan Dokumentasi & Informasi Hukum</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Regulasi & Produk Hukum Pengawasan
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Basis regulasi hukum pengawasan penyelenggaraan pemerintahan daerah, pengelolaan keuangan desa, PKPT, evaluasi kinerja Pj kepala daerah, dan netralitas ASN.
        </p>

        {/* Tab Sub Jenis Regulasi */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {['Semua', 'Permendagri', 'Kepmendagri', 'SE'].map((jenis) => (
            <button
              key={jenis}
              onClick={() => setJenisFilter(jenis)}
              className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                jenisFilter === jenis
                  ? 'bg-[#063a69] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{jenis === 'SE' ? 'Surat Edaran (SE)' : jenis}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bar Pencarian & Filter Tahun */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tahun */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Tahun:</span>
          <div className="flex flex-wrap gap-1">
            {availableYears.map((th) => (
              <button
                key={th}
                onClick={() => setTahunFilter(th)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  tahunFilter === th
                    ? 'bg-[#063a69] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>

        {/* Kotak Pencarian */}
        <div className="relative min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor peraturan atau tentang..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69]"
          />
        </div>
      </div>

      {/* Daftar Regulasi */}
      <div className="space-y-4">
        {filteredRegulations.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Informasi Dokumen */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-heading font-bold uppercase px-2.5 py-0.5 rounded ${
                  reg.jenis === 'Permendagri'
                    ? 'bg-[#063a69] text-[#fbae17]'
                    : reg.jenis === 'Kepmendagri'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {reg.jenis}
                </span>

                <span className="text-xs font-bold text-slate-800">
                  {reg.nomor}
                </span>

                <span className="text-[11px] text-slate-400">&bull;</span>

                <span className="text-xs text-slate-500">
                  Tahun {reg.tahun}
                </span>

                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{reg.status || 'Berlaku'}</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-sm sm:text-base text-[#063a69] leading-snug">
                {reg.tentang}
              </h3>

              <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ditetapkan: {reg.tanggalDitetapkan || '-'}</span>
                </div>
                {reg.ukuranFile && (
                  <span>Ukuran: {reg.ukuranFile}</span>
                )}
              </div>
            </div>

            {/* Tombol Aksi Unduh */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => {
                  alert(`Memulai unduhan dokumen salinan resmi: ${reg.nomor}`);
                }}
                className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-[#fbae17]" />
                <span>Unduh Dokumen</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRegulations.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <p className="font-heading font-bold text-base text-[#063a69]">Tidak Ada Regulasi Ditemukan</p>
          <p className="text-xs">Coba sesuaikan jenis dokumen, filter tahun, atau kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
