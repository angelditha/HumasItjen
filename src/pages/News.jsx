import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Eye, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Tag, 
  User, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function News({ 
  dbData, 
  activeSubPage, 
  setActiveSubPage,
  selectedNews, 
  setSelectedNews 
}) {
  const allNews = dbData?.news || [];

  const getCategoryFromSubPage = (sub) => (
    sub === 'berita-nasional'
      ? 'nasional'
      : sub === 'berita-kemendagri'
      ? 'kemendagri'
      : sub === 'berita-pengawasan'
      ? 'pengawasan'
      : 'semua'
  );

  const [categoryFilter, setCategoryFilter] = useState(getCategoryFromSubPage(activeSubPage));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCategoryFilter(getCategoryFromSubPage(activeSubPage));
  }, [activeSubPage]);

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    if (setActiveSubPage) {
      const subMap = {
        semua: null,
        pengawasan: 'berita-pengawasan',
        kemendagri: 'berita-kemendagri',
        nasional: 'berita-nasional'
      };
      setActiveSubPage(subMap[cat] ?? null);
    }
  };

  const filteredNews = allNews.filter((item) => {
    const matchesCategory = categoryFilter === 'semua' || item.kategori === categoryFilter;
    const matchesSearch = 
      item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.konten?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // JIKA SEDANG MEMBACA DETAIL BERITA TERTENTU
  if (selectedNews) {
    const relatedNews = allNews
      .filter((n) => n.id !== selectedNews.id && n.kategori === selectedNews.kategori)
      .slice(0, 3);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Tombol Kembali */}
        <button
          onClick={() => setSelectedNews(null)}
          className="inline-flex items-center space-x-2 text-xs font-heading font-bold uppercase tracking-wider text-[#063a69] hover:text-[#d48f05] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </button>

        {/* Artikel Detail */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Berita */}
          <div className="p-6 sm:p-10 space-y-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#fbae17] text-[#063a69] text-xs font-heading font-bold uppercase px-3 py-1 rounded">
                {selectedNews.kategori === 'pengawasan'
                  ? 'Rilis Organik Itjen'
                  : selectedNews.kategori === 'kemendagri'
                  ? 'Berita Kemendagri'
                  : 'Berita Nasional'}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-[#fbae17]" />
                <span>{selectedNews.tanggal}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedNews.penulis || 'Humas Itjen Kemendagri'}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedNews.views || 950} tayangan</span>
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#063a69] leading-snug">
              {selectedNews.judul}
            </h1>
          </div>

          {/* Foto Utama Berita Landscape */}
          <div className="relative w-full h-80 sm:h-96 md:h-[450px] bg-slate-100">
            <img
              src={selectedNews.gambar || '/assets/photo-rakornas.jpg'}
              alt={selectedNews.judul}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Isi Konten Berita */}
          <div className="p-6 sm:p-10 space-y-6 text-sm sm:text-base text-slate-800 leading-relaxed font-body">
            {/* Konten Paragraf */}
            <div className="space-y-4 whitespace-pre-line text-justify">
              {selectedNews.konten || selectedNews.ringkasan}
            </div>

            {/* Bagian Bawah Artikel */}
            <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Tag className="w-4 h-4 text-[#d48f05]" />
                <span>Kategori: <strong>{selectedNews.kategori}</strong></span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Tautan berita berhasil disalin ke papan klip.');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#063a69]" />
                <span>Bagikan Berita</span>
              </button>
            </div>
          </div>
        </article>

        {/* Berita Terkait */}
        {relatedNews.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="font-heading font-bold text-xl text-[#063a69]">
              Berita Terkait Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedNews(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#d48f05] uppercase">
                      {item.tanggal}
                    </span>
                    <h4 className="font-heading font-bold text-xs text-[#063a69] line-clamp-2">
                      {item.judul}
                    </h4>
                  </div>
                  <div className="pt-3 text-[11px] font-semibold text-[#063a69] flex items-center space-x-1">
                    <span>Baca</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // TAMPILAN DAFTAR ARSIP BERITA
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Halaman Berita */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Pusat Berita & Informasi</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Arsip Berita Kemendagri & Pengawasan Itjen
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Menyajikan publikasi rilis resmi pengawasan intern (organik Itjen) serta publikasi re-upload berita Kementerian Dalam Negeri dan Berita Nasional.
        </p>
      </div>

      {/* Bar Filter Kategori & Kotak Pencarian */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Tab Kategori */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategoryChange('semua')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'semua'
                ? 'bg-[#063a69] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua ({allNews.length})
          </button>
          <button
            onClick={() => handleCategoryChange('pengawasan')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'pengawasan'
                ? 'bg-[#063a69] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pengawasan Itjen ({allNews.filter(n => n.kategori === 'pengawasan').length})
          </button>
          <button
            onClick={() => handleCategoryChange('kemendagri')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'kemendagri'
                ? 'bg-[#063a69] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kemendagri ({allNews.filter(n => n.kategori === 'kemendagri').length})
          </button>
          <button
            onClick={() => handleCategoryChange('nasional')}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
              categoryFilter === 'nasional'
                ? 'bg-[#063a69] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nasional ({allNews.filter(n => n.kategori === 'nasional').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69]"
          />
        </div>
      </div>

      {/* Grid Kartu Berita */}
      {filteredNews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <p className="font-heading font-bold text-base text-[#063a69]">Tidak Ada Berita Ditemukan</p>
          <p className="text-xs">Coba ubah kata kunci pencarian atau pilih kategori berita lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                setSelectedNews(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Gambar Berita */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src={item.gambar || '/assets/photo-hall.jpg'}
                  alt={item.judul}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#063a69]/90 backdrop-blur-sm text-[#fbae17] font-heading font-semibold text-[11px] px-2.5 py-1 rounded shadow">
                    {item.kategori === 'pengawasan'
                      ? 'Pengawasan'
                      : item.kategori === 'kemendagri'
                      ? 'Kemendagri'
                      : 'Nasional'}
                  </span>
                </div>
              </div>

              {/* Isi Ringkasan */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#fbae17]" />
                    <span>{item.tanggal}</span>
                    <span>&bull;</span>
                    <span className="truncate">{item.penulis || 'Humas Itjen'}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#0a4f8f] transition-colors leading-snug line-clamp-2">
                    {item.judul}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.konten || item.ringkasan}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05] transition-colors">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
