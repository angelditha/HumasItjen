import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Eye, 
  ArrowRight, 
  Star, 
  Shield, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  ExternalLink, 
  CheckCircle, 
  CheckCircle2,
  Building2, 
  Send, 
  Sparkles, 
  SlidersHorizontal,
  ThumbsUp,
  User,
  Quote
} from 'lucide-react';
import { submitRating } from '../api';

export default function Home({ 
  dbData, 
  onNavigate, 
  onSelectNews, 
  onOpenMediaModal,
  onRefreshData 
}) {
  const newsList = dbData?.news || [];
  const bannerNews = newsList.filter(n => n.isBanner) || [];
  const activeBanners = bannerNews.length > 0 ? bannerNews : newsList.slice(0, 3);

  // Banner carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // News category tab state in Home
  const [newsTab, setNewsTab] = useState('semua');

  // Rating form state
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingName, setRatingName] = useState('');
  const [ratingInstansi, setRatingInstansi] = useState('');
  const [ratingReview, setRatingReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSuccessMsg, setRatingSuccessMsg] = useState('');

  // Auto rotate banner every 5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const filteredNews = newsTab === 'semua' 
    ? newsList.slice(0, 6) 
    : newsList.filter(n => n.kategori === newsTab).slice(0, 6);

  // Media highlights
  const photos = (dbData?.media?.photos || []).slice(0, 4);
  const videos = (dbData?.media?.videos || []).slice(0, 2);
  const infographics = (dbData?.media?.infographics || []).slice(0, 2);

  // Ratings
  const ratings = dbData?.ratings || [];
  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / ratings.length).toFixed(1)
    : '4.9';

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingName.trim() || !ratingReview.trim()) return;

    setSubmittingRating(true);
    try {
      const payload = {
        nama: ratingName.trim(),
        instansi: ratingInstansi.trim() || 'Masyarakat Umum',
        rating: ratingScore,
        ulasan: ratingReview.trim(),
        tanggal: new Date().toISOString().split('T')[0]
      };
      await submitRating(payload);
      setRatingSuccessMsg('Terima kasih. Penilaian Anda telah berhasil dikirim dan tersimpan di sistem Humas Itjen.');
      setRatingName('');
      setRatingInstansi('');
      setRatingReview('');
      setRatingScore(5);
      if (onRefreshData) onRefreshData();
      setTimeout(() => setRatingSuccessMsg(''), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* 1. HEADER: FOTO LANDSCAPE BERITA (HERO CAROUSEL) */}
      <section 
        className="relative bg-[#042646] overflow-hidden shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {activeBanners.length > 0 && (
          <div className="relative min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
            {activeBanners.map((item, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Foto Landscape Berita */}
                  <div className="absolute inset-0">
                    <img
                      src={item.gambar || '/assets/photo-rakornas.jpg'}
                      alt={item.judul}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient Overlay Transparan Lembut - Foto Jernih & Teks Terbaca Jelas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Konten Berita Landscape */}
                  <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-end pb-16 pt-24">
                    <div className="max-w-3xl space-y-4">
                      {/* Badge Kategori & Tanggal */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#fbae17] text-[#063a69] font-heading font-bold text-xs uppercase px-3 py-1 rounded-sm shadow-sm tracking-wider">
                          {item.kategori === 'pengawasan' 
                            ? 'Berita Pengawasan Itjen' 
                            : item.kategori === 'kemendagri' 
                            ? 'Berita Kemendagri' 
                            : 'Berita Nasional'}
                        </span>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-200 bg-black/40 px-3 py-1 rounded backdrop-blur-sm">
                          <Calendar className="w-3.5 h-3.5 text-[#fbae17]" />
                          <span>{item.tanggal}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-black/40 px-2.5 py-1 rounded backdrop-blur-sm">
                          <Eye className="w-3.5 h-3.5 text-slate-300" />
                          <span>{item.views || 850} tayangan</span>
                        </div>
                      </div>

                      {/* Judul Berita Utama */}
                      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white leading-snug drop-shadow-md">
                        {item.judul}
                      </h2>

                      {/* Cuplikan Berita */}
                      <p className="text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
                        {item.konten || item.ringkasan}
                      </p>

                      {/* Tombol CTA Baca Selengkapnya */}
                      <div className="pt-2">
                        <button
                          onClick={() => onSelectNews(item)}
                          className="inline-flex items-center space-x-2 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] font-heading font-bold text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all group"
                        >
                          <span>Baca Berita Lengkap</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigasi Carousel Tombol Kiri Kanan */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#fbae17] text-white hover:text-[#063a69] flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
              title="Berita Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#fbae17] text-white hover:text-[#063a69] flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
              title="Berita Berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indikator Titik Carousel */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-8 bg-[#fbae17]' 
                      : 'w-2.5 bg-white/50 hover:bg-white'
                  }`}
                  title={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* QUICK HIGHLIGHT STRIP: PILAR APIP ITJEN KEMENDAGRI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-[#063a69] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#063a69]/10 text-[#063a69] flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-[#063a69]">38 Provinsi</div>
              <div className="text-xs text-slate-500 font-medium">Koordinasi APIP Daerah</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-[#fbae17] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#fbae17]/15 text-[#d48f05] flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-[#063a69]">100% Terintegrasi</div>
              <div className="text-xs text-slate-500 font-medium">Kanal WBS & Pengawasan APBD</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-[#063a69] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#063a69]/10 text-[#063a69] flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-[#063a69]">8 Layanan</div>
              <div className="text-xs text-slate-500 font-medium">Digitalisasi Pengawasan APIP</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-[#fbae17] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#fbae17]/15 text-[#d48f05] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl text-[#063a69]">BerAKHLAK</div>
              <div className="text-xs text-slate-500 font-medium">Pengawasan Berdampak Nyata</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION B: BERITA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
              <span>Publikasi Informasi Resmi</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#063a69] mt-1">
              Berita & Informasi Terkini
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Kanal pemberitaan resmi pengawasan intern dan agenda penyelenggaraan urusan pemerintahan dalam negeri.
            </p>
          </div>

          {/* Kategori Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-lg">
            <button
              onClick={() => setNewsTab('semua')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                newsTab === 'semua'
                  ? 'bg-[#063a69] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#063a69] hover:bg-white/50'
              }`}
            >
              Semua Berita
            </button>
            <button
              onClick={() => setNewsTab('pengawasan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                newsTab === 'pengawasan'
                  ? 'bg-[#063a69] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#063a69] hover:bg-white/50'
              }`}
            >
              Berita Pengawasan (Itjen)
            </button>
            <button
              onClick={() => setNewsTab('kemendagri')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                newsTab === 'kemendagri'
                  ? 'bg-[#063a69] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#063a69] hover:bg-white/50'
              }`}
            >
              Berita Kemendagri
            </button>
            <button
              onClick={() => setNewsTab('nasional')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                newsTab === 'nasional'
                  ? 'bg-[#063a69] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#063a69] hover:bg-white/50'
              }`}
            >
              Berita Nasional
            </button>
          </div>
        </div>

        {/* Grid Kartu Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item)}
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

                  <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#0a4f8f] transition-colors leading-snug line-clamp-2">
                    {item.judul}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.konten || item.ringkasan}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05] transition-colors">
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Tombol Lihat Semua Berita */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('berita')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-[#063a69] text-[#063a69] hover:bg-[#063a69] hover:text-white font-heading font-semibold text-xs uppercase tracking-wider rounded-lg shadow-xs hover:shadow-md transition-all"
          >
            <span>Buka Seluruh Arsip Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. SECTION C: MEDIA (HANYA TANGGAL DAN JUDUL) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
                <span>Dokumentasi & Visualisasi</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#063a69] mt-1">
                Galeri Media Pengawasan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Dokumentasi foto kegiatan lapangan, rekaman video liputan, dan infografis pengawasan.
              </p>
            </div>

            <button
              onClick={() => onNavigate('media')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#063a69] hover:text-[#d48f05] uppercase tracking-wider"
            >
              <span>Lihat Semua Galeri Media</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom 1 & 2: Foto Kegiatan Utama (Hanya Tanggal dan Judul) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-[#fbae17]" />
                  <span>Foto Dokumentasi Pengawasan</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onOpenMediaModal('foto', photo)}
                    className="relative group rounded-xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200 cursor-pointer bg-white flex flex-col"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.judul}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Hanya Tanggal dan Judul */}
                    <div className="p-4 space-y-1">
                      <div className="text-xs text-slate-500 font-medium">
                        {photo.tanggal}
                      </div>
                      <h5 className="font-heading font-bold text-sm text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                        {photo.judul}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom 3: Video & Infografis (Hanya Tanggal dan Judul) */}
            <div className="space-y-6">
              {/* Highlight Video */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider flex items-center space-x-2">
                  <Video className="w-4 h-4 text-[#fbae17]" />
                  <span>Video Liputan Pengawasan</span>
                </h4>
                {videos[0] && (
                  <div
                    onClick={() => onOpenMediaModal('video', videos[0])}
                    className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200 cursor-pointer group flex flex-col"
                  >
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src="/assets/photo-rakornas.jpg"
                        alt={videos[0].judul}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#fbae17] text-[#063a69] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Video className="w-6 h-6 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    {/* Hanya Tanggal dan Judul */}
                    <div className="p-4 space-y-1">
                      <div className="text-xs text-slate-500 font-medium">
                        {videos[0].tanggal}
                      </div>
                      <h5 className="font-heading font-bold text-sm text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                        {videos[0].judul}
                      </h5>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight Infografis */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#fbae17]" />
                  <span>Infografis Pengawasan</span>
                </h4>
                {infographics[0] && (
                  <div
                    onClick={() => onOpenMediaModal('infografis', infographics[0])}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer flex items-center space-x-3 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={infographics[0].url}
                        alt={infographics[0].judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    {/* Hanya Tanggal dan Judul */}
                    <div className="space-y-0.5 flex-1">
                      <div className="text-xs text-slate-500 font-medium">
                        {infographics[0].tanggal}
                      </div>
                      <h5 className="font-heading font-bold text-xs text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                        {infographics[0].judul}
                      </h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION D: APLIKASI DAN LAYANAN ITJEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center justify-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
            <span>Integrasi Portal Pelayanan</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#063a69]">
            Aplikasi dan Layanan Pengawasan Itjen
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Akses langsung ke platform digital pengawasan, pelaporan pengaduan, dan keterbukaan informasi publik Kementerian Dalam Negeri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. WBS OTDA */}
          <a
            href="https://otda.kemendagri.go.id/layananwbs"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Prioritas
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                WBS Kemendagri
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Whistleblowing System untuk melaporkan dugaan korupsi atau penyalahgunaan wewenang dengan kerahasiaan terjamin.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Kunjungi Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 2. SIPD RI */}
          <a
            href="https://sipd.kemendagri.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#063a69] bg-slate-100 px-2 py-0.5 rounded">
                  Nasional
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                SIPD RI
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sistem Informasi Pemerintahan Daerah menyatukan data perencanaan dan penganggaran seluruh Pemda.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Akses SIPD</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 3. SIOLA */}
          <a
            href="https://siola.kemendagri.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Layanan Publik
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                Siola Kemendagri
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sistem Informasi Online Layanan Administrasi mempermudah konsultasi perizinan dan tata kelola daerah.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Buka Layanan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 4. SP4N LAPOR */}
          <a
            href="https://www.lapor.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Pengaduan
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                SP4N LAPOR!
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Kanal aspirasi dan pengaduan pelayanan publik terpadu se-Indonesia yang diawasi oleh KemenPAN-RB dan Kemendagri.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Kirim Pengaduan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 5. SIWASIAT */}
          <button
            onClick={() => onNavigate('layanan', 'layanan-publik')}
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#063a69] bg-slate-100 px-2 py-0.5 rounded">
                  Internal APIP
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                Siwasiat
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sistem Informasi Pengawasan Terpadu memantau tindak lanjut rekomendasi Laporan Hasil Pengawasan (LHP).
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Detail Aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 6. APLIKASI PPUPD */}
          <button
            onClick={() => onNavigate('layanan', 'layanan-publik')}
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#063a69] bg-slate-100 px-2 py-0.5 rounded">
                  Fungsional
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                Aplikasi PPUPD
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Platform pembinaan karier dan pemantauan kinerja Pejabat Fungsional PPUPD seluruh Indonesia.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Detail Aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 7. E-REVIU */}
          <button
            onClick={() => onNavigate('layanan', 'layanan-publik')}
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Reviu APBD
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                E-Reviu Dokumen
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Asistensi digital dalam penelaahan dokumen RKPD dan KUA-PPAS Pemerintah Daerah sebelum penetapan APBD.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Detail Aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 8. SI CUKUP */}
          <button
            onClick={() => onNavigate('layanan', 'layanan-publik')}
            className="p-5 bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#fbae17] transition-all group flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Kepatuhan
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                Si Cukup
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sistem Uji Kepatuhan & Mitigasi Risiko Sistem Pengendalian Intern Pemerintah (SPIP) Terintegrasi.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
              <span>Detail Aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* 5. SECTION E: PENILAIAN PENGGUNA (PENILAIAN WEBSITE) */}
      <section id="rating-section" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#063a69] to-[#042646] rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle watermark logo */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
            <img src="/assets/logo-anggaraksa.png" alt="" className="w-96 h-96" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Info & Statistik Kepuasan Website */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="bg-[#fbae17] text-[#063a69] text-xs font-heading font-bold uppercase px-3 py-1 rounded">
                  Evaluasi Layanan
                </span>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-2">
                  Penilaian Pengguna Website
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  Bantu Tim Humas Itjen Kemendagri meningkatkan kualitas keterbukaan informasi publik dan kemudahan akses portal dengan memberikan ulasan serta skor bintang Anda.
                </p>
              </div>

              {/* Rata-rata Skor Bintang */}
              <div className="bg-white/10 p-5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center space-x-6">
                <div className="text-center">
                  <div className="font-heading font-black text-4xl text-[#fbae17]">
                    {avgRating}
                  </div>
                  <div className="text-[11px] text-slate-300">dari 5.0 Bintang</div>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#fbae17] text-[#fbae17]" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-200 font-medium">
                    Berdasarkan {ratings.length} responden terverifikasi
                  </div>
                </div>
              </div>

              {/* Kutipan Ulasan Terkini */}
              {ratings.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Ulasan Pengguna Terkini:
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-xs text-slate-200 italic space-y-1.5">
                    <Quote className="w-4 h-4 text-[#fbae17] opacity-60" />
                    <p>"{ratings[0].ulasan}"</p>
                    <div className="text-[11px] font-semibold text-white not-italic pt-1">
                      — {ratings[0].nama} ({ratings[0].instansi || 'Masyarakat'})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Formulir Penilaian Interaktif */}
            <div className="lg:col-span-7 bg-white text-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-100">
              <h4 className="font-heading font-bold text-lg text-[#063a69] mb-1">
                Kirim Penilaian Anda
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                Setiap masukan bernilai penting bagi penyempurnaan layanan digital pengawasan Itjen Kemendagri.
              </p>

              {ratingSuccessMsg && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                  <span>{ratingSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleRatingSubmit} className="space-y-4">
                {/* Rating Bintang */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tingkat Kepuasan Website
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingScore(star)}
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                        title={`Beri nilai ${star} bintang`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            (ratingHover || ratingScore) >= star
                              ? 'fill-[#fbae17] text-[#fbae17]'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-2">
                      ({ratingScore} dari 5 bintang)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={ratingName}
                      onChange={(e) => setRatingName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Instansi / Asal Daerah
                    </label>
                    <input
                      type="text"
                      value={ratingInstansi}
                      onChange={(e) => setRatingInstansi(e.target.value)}
                      placeholder="Contoh: Inspektorat Daerah / Umum"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ulasan & Saran Perbaikan *
                  </label>
                  <textarea
                    rows={3}
                    value={ratingReview}
                    onChange={(e) => setRatingReview(e.target.value)}
                    placeholder="Tuliskan pengalaman Anda dalam menavigasi portal dan mencari dokumen pengawasan..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                    required
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="px-6 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow hover:shadow-md transition-all flex items-center space-x-2 disabled:opacity-70"
                  >
                    <Send className="w-3.5 h-3.5 text-[#fbae17]" />
                    <span>{submittingRating ? 'Mengirim...' : 'Kirim Penilaian'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
