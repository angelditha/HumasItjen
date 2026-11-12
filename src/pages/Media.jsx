import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  Calendar, 
  X, 
  Download, 
  Maximize2, 
  Play,
  ArrowRight
} from 'lucide-react';

export default function Media({ dbData, activeSubPage, setActiveSubPage }) {
  const mediaData = dbData?.media || { photos: [], videos: [], infographics: [] };

  const getTabFromSubPage = (sub) => (
    sub === 'media-video'
      ? 'video'
      : sub === 'media-infografis'
      ? 'infografis'
      : 'foto'
  );

  const [activeTab, setActiveTab] = useState(getTabFromSubPage(activeSubPage));
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setActiveTab(getTabFromSubPage(activeSubPage));
  }, [activeSubPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (setActiveSubPage) {
      setActiveSubPage(`media-${tab}`);
    }
  };

  const mediaTitleMap = {
    foto: 'Foto Dokumentasi Pengawasan',
    video: 'Video Liputan Pengawasan',
    infografis: 'Infografis Edukasi Pengawasan'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Galeri Publikasi Audio-Visual</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          {mediaTitleMap[activeTab] || 'Pusat Media & Dokumentasi Pengawasan'}
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Koleksi dokumentasi foto resmi kegiatan pengawasan, video liputan edukasi antikorupsi, dan infografis pengawasan APBD.
        </p>
      </div>

      {/* 1. TAB FOTO (HANYA TANGGAL DAN JUDUL) */}
      {activeTab === 'foto' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {mediaData.photos?.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedItem({ ...photo, type: 'foto' })}
              className="bg-white rounded-xl shadow-xs hover:shadow-lg border border-slate-200 overflow-hidden cursor-pointer group transition-all flex flex-col"
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.judul}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 text-[#063a69] flex items-center justify-center shadow">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Hanya Tanggal dan Judul */}
              <div className="p-4 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  {photo.tanggal}
                </div>
                <h3 className="font-heading font-bold text-sm text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                  {photo.judul}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. TAB VIDEO (HANYA TANGGAL DAN JUDUL) */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {mediaData.videos?.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setSelectedItem({ ...vid, type: 'video' })}
              className="bg-white rounded-xl shadow-xs hover:shadow-lg border border-slate-200 overflow-hidden cursor-pointer group transition-all flex flex-col"
            >
              <div className="relative h-52 bg-slate-900 overflow-hidden">
                <img
                  src="/assets/photo-rakornas.jpg"
                  alt={vid.judul}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#fbae17] text-[#063a69] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1 fill-current" />
                  </div>
                </div>
              </div>

              {/* Hanya Tanggal dan Judul */}
              <div className="p-4 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  {vid.tanggal}
                </div>
                <h3 className="font-heading font-bold text-sm text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                  {vid.judul}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. TAB INFOGRAFIS (HANYA TANGGAL DAN JUDUL) */}
      {activeTab === 'infografis' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {mediaData.infographics?.map((info) => (
            <div
              key={info.id}
              onClick={() => setSelectedItem({ ...info, type: 'infografis' })}
              className="bg-white rounded-xl shadow-xs hover:shadow-lg border border-slate-200 overflow-hidden cursor-pointer group transition-all flex flex-col"
            >
              <div className="relative h-72 bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={info.url}
                  alt={info.judul}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 text-[#063a69] flex items-center justify-center shadow">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Hanya Tanggal dan Judul */}
              <div className="p-4 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  {info.tanggal}
                </div>
                <h3 className="font-heading font-bold text-sm text-[#063a69] group-hover:text-[#0a4f8f] break-words leading-snug">
                  {info.judul}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PREVIEW MEDIA (HANYA TANGGAL DAN JUDUL) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
            {/* Header Modal */}
            <div className="bg-[#063a69] text-white p-4 px-5 sm:px-6 flex items-start justify-between gap-3 flex-shrink-0">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white break-words whitespace-normal flex-1 min-w-0 leading-snug">
                {selectedItem.judul}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/15 transition-colors flex-shrink-0"
                title="Tutup"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Media Content */}
            <div className="p-4 bg-slate-950 flex items-center justify-center flex-1 min-h-0 overflow-auto">
              {selectedItem.type === 'video' ? (
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedItem.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1`}
                    title={selectedItem.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.judul}
                  className="max-h-[58vh] w-auto object-contain mx-auto"
                />
              )}
            </div>

            {/* Footer Modal: Hanya Tanggal dan Judul */}
            <div className="p-4 px-5 sm:px-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 flex-shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500 font-medium">
                  {selectedItem.tanggal}
                </div>
                <div className="font-heading font-bold text-sm text-[#063a69] break-words leading-snug">
                  {selectedItem.judul}
                </div>
              </div>
              {selectedItem.type !== 'video' && (
                <a
                  href={selectedItem.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#063a69] hover:underline self-start sm:self-auto"
                >
                  <Download className="w-4 h-4 text-[#fbae17]" />
                  <span>Unduh File</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
