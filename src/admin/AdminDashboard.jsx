import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  User,
  Image as ImageIcon, 
  Building2, 
  FileText, 
  Globe2, 
  Star, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Calendar,
  Eye,
  Sliders,
  Shield,
  Video,
  Play,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Target,
  Award,
  FileCheck,
  Landmark
} from 'lucide-react';
import { 
  createNews, updateNews, deleteNews,
  createOfficer, updateOfficer, deleteOfficer,
  createMedia, updateMedia, deleteMedia,
  createInspectorate, updateInspectorate, deleteInspectorate,
  createRegulation, updateRegulation, deleteRegulation,
  createService, updateService, deleteService,
  deleteRating, deleteSkm,
  uploadFile,
  updateProfile
} from '../api';

export default function AdminDashboard({ 
  dbData, 
  adminUser, 
  onLogout, 
  onSwitchToPublic,
  onRefreshData 
}) {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  // Media Tab filter in Admin
  const [mediaSubTab, setMediaSubTab] = useState('all'); // 'all', 'photos', 'videos', 'infographics'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentEntity, setCurrentEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Profile management states
  const [profileSubTab, setProfileSubTab] = useState('visi-misi');
  const [profileForm, setProfileForm] = useState(null);
  const [newMisiText, setNewMisiText] = useState('');
  const [newFungsiText, setNewFungsiText] = useState('');
  const [newFilosofiKemendagri, setNewFilosofiKemendagri] = useState('');
  const [newFilosofiAnggaraksa, setNewFilosofiAnggaraksa] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (dbData?.profile) {
      setProfileForm(JSON.parse(JSON.stringify(dbData.profile)));
    }
  }, [dbData?.profile]);

  const handleSaveProfile = async (customPayload = null) => {
    setSavingProfile(true);
    try {
      const payload = customPayload || profileForm;
      const res = await updateProfile(payload);
      if (res?.success || res) {
        showToast('Perubahan data profil institusi berhasil disimpan.');
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadStrukturFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.success) {
        setProfileForm(prev => ({
          ...prev,
          strukturOrganisasi: {
            ...(prev?.strukturOrganisasi || {}),
            foto: res.url
          }
        }));
        showToast('Foto bagan struktur organisasi berhasil diunggah.');
      }
    } catch (err) {
      alert('Gagal mengunggah foto bagan struktur organisasi.');
    } finally {
      setUploading(false);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.success) {
        setFormData(prev => ({ ...prev, [fieldName]: res.url }));
        showToast('File berhasil diunggah: ' + res.filename);
      }
    } catch (err) {
      alert('Gagal mengunggah file. Pastikan server aktif.');
    } finally {
      setUploading(false);
    }
  };

  // Open modal
  const openModal = (mode, entity = null) => {
    setModalMode(mode);
    setCurrentEntity(entity);
    if (mode === 'edit' && entity) {
      setFormData({ ...entity });
    } else {
      // Default blank values based on active tab
      if (activeTab === 'berita') {
        setFormData({
          judul: '',
          kategori: 'pengawasan',
          tanggal: new Date().toISOString().split('T')[0],
          penulis: 'Tim Humas Itjen Kemendagri',
          gambar: '/assets/photo-hall.jpg',
          konten: '',
          isBanner: false
        });
      } else if (activeTab === 'pejabat') {
        // Cukup foto, nama, jabatan!
        setFormData({
          nama: '',
          jabatan: '',
          foto: '/assets/officer-arief.png',
          urutan: (dbData?.officers?.length || 0) + 1
        });
      } else if (activeTab === 'media') {
        // Full CRUDS media form
        setFormData({
          mediaType: mediaSubTab !== 'all' ? mediaSubTab : 'photos',
          judul: '',
          tanggal: new Date().toISOString().split('T')[0],
          url: '/assets/photo-rakornas.jpg',
          youtubeId: 'dQw4w9WgXcQ'
        });
      } else if (activeTab === 'daerah') {
        setFormData({
          nama: '',
          ibukota: '',
          wilayah: 'Sumatera',
          inspektur: '',
          telp: '',
          website: 'https://inspektorat.'
        });
      } else if (activeTab === 'regulasi') {
        setFormData({
          jenis: 'Permendagri',
          nomor: '',
          tahun: '2026',
          tentang: '',
          tanggalDitetapkan: new Date().toISOString().split('T')[0],
          status: 'Berlaku',
          ukuranFile: '2.5 MB'
        });
      } else if (activeTab === 'layanan') {
        setFormData({
          section: 'layananPublik',
          kode: '',
          nama: '',
          deskripsi: '',
          url: 'https://',
          kategori: 'Pengawasan'
        });
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setCurrentEntity(null);
  };

  // Save submit
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'berita') {
        const payload = {
          ...formData,
          ringkasan: formData.konten ? (formData.konten.slice(0, 150) + '...') : ''
        };
        if (modalMode === 'create') {
          await createNews(payload);
          showToast('Berita baru berhasil ditambahkan.');
        } else {
          await updateNews(currentEntity.id, payload);
          showToast('Berita berhasil diperbarui.');
        }
      } else if (activeTab === 'pejabat') {
        if (modalMode === 'create') {
          await createOfficer(formData);
          showToast('Data pejabat baru berhasil ditambahkan.');
        } else {
          await updateOfficer(currentEntity.id, formData);
          showToast('Data pejabat berhasil diperbarui.');
        }
      } else if (activeTab === 'media') {
        const type = formData.mediaType || currentEntity?.mediaType || 'photos';
        if (modalMode === 'create') {
          await createMedia(type, formData);
          showToast('Media baru berhasil ditambahkan.');
        } else {
          await updateMedia(type, currentEntity.id, formData);
          showToast('Media berhasil diperbarui.');
        }
      } else if (activeTab === 'daerah') {
        if (modalMode === 'create') {
          await createInspectorate(formData);
          showToast('Data Inspektorat Daerah berhasil ditambahkan.');
        } else {
          await updateInspectorate(currentEntity.id, formData);
          showToast('Data Inspektorat Daerah berhasil diperbarui.');
        }
      } else if (activeTab === 'regulasi') {
        if (modalMode === 'create') {
          await createRegulation(formData);
          showToast('Regulasi baru berhasil ditambahkan.');
        } else {
          await updateRegulation(currentEntity.id, formData);
          showToast('Regulasi berhasil diperbarui.');
        }
      } else if (activeTab === 'layanan') {
        const section = formData.section || 'layananPublik';
        if (modalMode === 'create') {
          await createService(section, formData);
          showToast('Layanan baru berhasil ditambahkan.');
        } else {
          await updateService(section, currentEntity.id, formData);
          showToast('Layanan berhasil diperbarui.');
        }
      }

      closeModal();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  // Delete entity
  const handleDelete = async (type, id, extra = null) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    try {
      if (type === 'berita') await deleteNews(id);
      if (type === 'pejabat') await deleteOfficer(id);
      if (type === 'media') await deleteMedia(extra, id);
      if (type === 'daerah') await deleteInspectorate(id);
      if (type === 'regulasi') await deleteRegulation(id);
      if (type === 'layanan') await deleteService(extra, id);
      if (type === 'rating') await deleteRating(id);
      if (type === 'skm') await deleteSkm(id);

      showToast('Data berhasil dihapus dari sistem.');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Gagal menghapus data.');
    }
  };

  // Compile all media list for easy CRUD view
  const allPhotos = (dbData?.media?.photos || []).map(m => ({ ...m, mediaType: 'photos' }));
  const allVideos = (dbData?.media?.videos || []).map(m => ({ ...m, mediaType: 'videos' }));
  const allInfographics = (dbData?.media?.infographics || []).map(m => ({ ...m, mediaType: 'infographics' }));
  const compiledMedia = [...allPhotos, ...allVideos, ...allInfographics];

  const filteredMediaList = compiledMedia.filter(m => {
    const matchesTab = mediaSubTab === 'all' || m.mediaType === mediaSubTab;
    const matchesSearch = !searchTerm || m.judul?.toLowerCase().includes(searchTerm.toLowerCase()) || m.tanggal?.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const totalMediaCount = compiledMedia.length;

  const navMenuItems = [
    { id: 'ringkasan', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'profil', label: 'Kelola Profil Institusi', icon: Landmark },
    { id: 'berita', label: 'Kelola Berita', icon: Newspaper, count: dbData?.news?.length },
    { id: 'pejabat', label: 'Kelola Profil Pejabat', icon: Users, count: dbData?.officers?.length },
    { id: 'media', label: 'Kelola Media (CRUDS)', icon: ImageIcon, count: totalMediaCount },
    { id: 'daerah', label: 'Kelola Inspektorat 38 Provinsi', icon: Building2, count: dbData?.inspectorates?.length },
    { id: 'regulasi', label: 'Kelola Regulasi', icon: FileText, count: dbData?.regulations?.length },
    { id: 'layanan', label: 'Kelola Layanan & Info Publik', icon: Globe2 },
    { id: 'penilaian', label: 'Moderasi Penilaian & SKM', icon: Star, count: (dbData?.ratings?.length || 0) + (dbData?.skmResponses?.length || 0) },
  ];

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col font-body text-slate-800">
      {/* 1. TOPBAR ADMIN ELEGAN DENGAN DUAL LOGO */}
      <header className="bg-gradient-to-r from-[#042646] via-[#063a69] to-[#042646] text-white shadow-lg sticky top-0 z-40 border-b-2 border-[#fbae17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-2 bg-white/10 p-1.5 rounded-lg border border-white/15 backdrop-blur-sm">
              <img src="/assets/logo-kemendagri.png" alt="Kemendagri" className="h-9 w-auto object-contain" />
              <div className="h-6 w-px bg-white/20"></div>
              <img src="/assets/logo-anggaraksa.png" alt="Itjen" className="h-9 w-auto object-contain" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#fbae17] uppercase tracking-wider">
                  Sesi Administrator Aktif
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-base sm:text-lg leading-tight text-white tracking-tight">
                Panel Pengelola Humas Itjen Kemendagri
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/15 text-xs text-slate-200">
              <User className="w-3.5 h-3.5 text-[#fbae17]" />
              <span className="font-semibold">{adminUser?.email || adminUser?.username || 'humas@gmail.com'}</span>
            </div>

            <button
              onClick={onSwitchToPublic}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-heading font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all border border-white/15 shadow-sm"
              title="Beralih ke tampilan pengunjung website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#fbae17]" />
              <span className="hidden sm:inline">Lihat Situs Publik</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
              title="Keluar dari sesi administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* TOAST NOTIFIKASI */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#063a69] text-white px-5 py-3.5 rounded-xl shadow-2xl border-2 border-[#fbae17] flex items-center space-x-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#fbae17]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. BODY CONTENT: SIDEBAR + MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR NAVIGATION CARD */}
        <aside className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2 sticky top-24">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400">
              Navigasi Konten
            </span>
            <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              CRUDS
            </span>
          </div>

          <div className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-heading font-semibold transition-all ${
                    isActive
                      ? 'bg-[#063a69] text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-[#063a69]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#fbae17]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-[#fbae17] text-[#063a69]' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 text-[11px] text-slate-400 px-3 flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-[#fbae17]" />
            <span>Kerahasiaan data terjamin.</span>
          </div>
        </aside>

        {/* MAIN CRUD WORKSPACE CARD */}
        <main className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8 min-h-[600px]">
          {/* TAB 1: DASHBOARD UTAMA */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Executive Welcome Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#063a69] to-[#042646] rounded-2xl p-6 sm:p-8 text-white shadow-md border-b-4 border-[#fbae17]">
                <div className="relative z-10 space-y-2 max-w-2xl">
                  <span className="text-[10px] font-heading font-bold text-[#fbae17] uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded">
                    Sistem Publikasi Terpadu
                  </span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    Selamat Datang di Portal Admin Humas
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Kelola dan perbarui seluruh informasi pengawasan, rilis berita, data pejabat, 38 Inspektorat Daerah, dan respon masyarakat secara *real-time*.
                  </p>
                </div>

                <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none">
                  <img src="/assets/logo-anggaraksa.png" alt="" className="w-56 h-56" />
                </div>
              </div>

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Berita Aktif</span>
                    <Newspaper className="w-4 h-4 text-[#063a69]" />
                  </div>
                  <div className="font-heading font-black text-3xl text-[#063a69]">{dbData?.news?.length || 0}</div>
                  <div className="text-[10px] text-slate-500">Pengawasan, Kemendagri, Nasional</div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Pejabat Utama</span>
                    <Users className="w-4 h-4 text-[#d48f05]" />
                  </div>
                  <div className="font-heading font-black text-3xl text-[#063a69]">{dbData?.officers?.length || 0}</div>
                  <div className="text-[10px] text-slate-500">Susunan Pimpinan Itjen</div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Total Media</span>
                    <ImageIcon className="w-4 h-4 text-[#063a69]" />
                  </div>
                  <div className="font-heading font-black text-3xl text-[#063a69]">{totalMediaCount}</div>
                  <div className="text-[10px] text-slate-500">Foto, Video, Infografis</div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">APIP Daerah</span>
                    <Building2 className="w-4 h-4 text-[#d48f05]" />
                  </div>
                  <div className="font-heading font-black text-3xl text-[#063a69]">{dbData?.inspectorates?.length || 0}</div>
                  <div className="text-[10px] text-slate-500">38 Provinsi Terhubung</div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider">
                  Aksi Cepat Pengelolaan:
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => { setActiveTab('berita'); openModal('create'); }}
                    className="px-4 py-2 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#fbae17]" />
                    <span>Tambah Berita Baru</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('pejabat'); openModal('create'); }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#063a69] border border-slate-300 text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d48f05]" />
                    <span>Tambah Pejabat Baru</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('media'); openModal('create'); }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#063a69] border border-slate-300 text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d48f05]" />
                    <span>Unggah Media Baru</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('regulasi'); openModal('create'); }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#063a69] border border-slate-300 text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d48f05]" />
                    <span>Tambah Regulasi Baru</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KELOLA PROFIL INSTITUSI & SUB-BAGIAN */}
          {activeTab === 'profil' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Profil Institusi & Sub-Bagian
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kelola Visi & Misi, Bagan Struktur Organisasi, Tugas & Fungsi, Core Value BerAKHLAK, dan Filosofi Lambang.
                  </p>
                </div>

                <button
                  onClick={() => handleSaveProfile()}
                  disabled={savingProfile}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4 text-[#fbae17]" />
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan Semua Profil'}</span>
                </button>
              </div>

              {/* Sub-Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                {[
                  { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
                  { id: 'struktur-organisasi', label: 'Struktur Organisasi', icon: Layers },
                  { id: 'tugas-fungsi', label: 'Tugas & Fungsi', icon: FileCheck },
                  { id: 'core-values', label: 'Core Value BerAKHLAK', icon: Award },
                  { id: 'logo-lambang', label: 'Logo & Filosofi', icon: Shield },
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = profileSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setProfileSubTab(st.id)}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-heading font-semibold transition-all ${
                        isActive
                          ? 'bg-[#063a69] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fbae17]' : 'text-slate-400'}`} />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1. SUB-TAB VISI & MISI */}
              {profileSubTab === 'visi-misi' && (
                <div className="space-y-6">
                  {/* Form Visi */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-[#063a69]">
                      <Target className="w-4 h-4 text-[#fbae17]" />
                      <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Visi Inspektorat Jenderal</h3>
                    </div>
                    <textarea
                      rows={3}
                      value={profileForm?.visi || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, visi: e.target.value }))}
                      placeholder="Masukkan visi resmi institusi..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 leading-relaxed focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                    />
                  </div>

                  {/* Form Misi */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#063a69]">
                        <Award className="w-4 h-4 text-[#fbae17]" />
                        <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Daftar Butir Misi Pengawasan</h3>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {(profileForm?.misi || []).length} Butir Misi
                      </span>
                    </div>

                    {/* List Misi */}
                    <div className="space-y-2.5">
                      {(profileForm?.misi || []).map((misiItem, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <span className="w-6 h-6 rounded-full bg-[#063a69] text-[#fbae17] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                            {idx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={misiItem}
                            onChange={(e) => {
                              const updated = [...(profileForm?.misi || [])];
                              updated[idx] = e.target.value;
                              setProfileForm(prev => ({ ...prev, misi: updated }));
                            }}
                            className="flex-1 p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#063a69]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (profileForm?.misi || []).filter((_, i) => i !== idx);
                              setProfileForm(prev => ({ ...prev, misi: updated }));
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                            title="Hapus Butir Misi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Input Tambah Misi Baru */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={newMisiText}
                        onChange={(e) => setNewMisiText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newMisiText.trim()) {
                              setProfileForm(prev => ({ ...prev, misi: [...(prev?.misi || []), newMisiText.trim()] }));
                              setNewMisiText('');
                            }
                          }
                        }}
                        placeholder="Tulis butir misi baru yang ingin ditambahkan..."
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMisiText.trim()) return;
                          setProfileForm(prev => ({ ...prev, misi: [...(prev?.misi || []), newMisiText.trim()] }));
                          setNewMisiText('');
                        }}
                        className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#fbae17]" />
                        <span>Tambah Butir</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveProfile()}
                      disabled={savingProfile}
                      className="px-5 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#fbae17]" />
                      <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Visi & Misi'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. SUB-TAB STRUKTUR ORGANISASI (UPLOAD FOTO STRUKTUR) */}
              {profileSubTab === 'struktur-organisasi' && (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
                    <div>
                      <div className="flex items-center space-x-2 text-[#063a69]">
                        <Layers className="w-4 h-4 text-[#fbae17]" />
                        <h3 className="font-heading font-bold text-sm uppercase tracking-wider">
                          Unggah Foto Bagan Struktur Organisasi
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Unggah gambar file resmi bagan struktur organisasi Itjen (PNG, JPG, WEBP). Foto ini akan langsung ditampilkan di halaman profil publik.
                      </p>
                    </div>

                    {/* Uploader Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-700 uppercase">
                          Pilih File Foto Bagan dari Komputer
                        </label>
                        <div className="flex items-center gap-2">
                          <label className={`flex-1 px-4 py-3 bg-white border-2 border-dashed border-[#063a69]/40 hover:border-[#063a69] rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload className="w-4 h-4 text-[#063a69]" />
                            <span className="text-xs font-semibold text-[#063a69]">
                              {uploading ? 'Sedang Mengunggah...' : 'Klik untuk Pilih & Unggah Gambar'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleUploadStrukturFoto}
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Atau Masukkan Tautan / Path URL Gambar:
                          </label>
                          <input
                            type="text"
                            value={profileForm?.strukturOrganisasi?.foto || ''}
                            onChange={(e) => setProfileForm(prev => ({
                              ...prev,
                              strukturOrganisasi: {
                                ...(prev?.strukturOrganisasi || {}),
                                foto: e.target.value
                              }
                            }))}
                            placeholder="Contoh: /uploads/file-bagan.png atau URL eksternal"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                          />
                        </div>

                        {profileForm?.strukturOrganisasi?.foto && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Apakah Anda yakin ingin menghapus foto bagan struktur organisasi? Tampilan akan kembali ke diagram standar.')) {
                                setProfileForm(prev => ({
                                  ...prev,
                                  strukturOrganisasi: {
                                    ...(prev?.strukturOrganisasi || {}),
                                    foto: ''
                                  }
                                }));
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus / Kosongkan Foto Terpasang</span>
                          </button>
                        )}
                      </div>

                      {/* Pratinjau Live */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase">
                          Pratinjau Foto Bagan Saat Ini
                        </label>
                        {profileForm?.strukturOrganisasi?.foto ? (
                          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white p-3 text-center space-y-2">
                            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                              <img
                                src={profileForm.strukturOrganisasi.foto}
                                alt="Pratinjau Bagan Struktur"
                                className="max-h-60 w-auto object-contain mx-auto rounded shadow-xs"
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 inline" />
                                <span>Foto Siap Ditampilkan</span>
                              </span>
                              <a
                                href={profileForm.strukturOrganisasi.foto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#063a69] font-semibold hover:underline flex items-center space-x-1"
                              >
                                <span>Lihat Penuh</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center bg-white">
                            <Layers className="w-8 h-8 text-slate-300 mb-2" />
                            <span className="text-xs font-semibold text-slate-500">Belum ada foto bagan yang diunggah</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Tampilan publik saat ini menggunakan diagram hierarki standar</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deskripsi / Dasar Hukum */}
                    <div className="pt-3 border-t border-slate-200 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Dasar Hukum & Keterangan Bagan
                      </label>
                      <textarea
                        rows={2}
                        value={profileForm?.strukturOrganisasi?.deskripsi || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          strukturOrganisasi: {
                            ...(prev?.strukturOrganisasi || {}),
                            deskripsi: e.target.value
                          }
                        }))}
                        placeholder="Contoh: Berdasarkan Peraturan Menteri Dalam Negeri tentang Organisasi dan Tata Kerja Kemendagri..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveProfile()}
                      disabled={savingProfile || uploading}
                      className="px-5 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#fbae17]" />
                      <span>{savingProfile ? 'Menyimpan...' : 'Simpan Bagan Struktur Organisasi'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SUB-TAB TUGAS & FUNGSI */}
              {profileSubTab === 'tugas-fungsi' && (
                <div className="space-y-6">
                  {/* Tugas Pokok */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-[#063a69]">
                      <FileCheck className="w-4 h-4 text-[#fbae17]" />
                      <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Tugas Pokok Inspektorat Jenderal</h3>
                    </div>
                    <textarea
                      rows={3}
                      value={profileForm?.tugasFungsi?.tugas || ''}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        tugasFungsi: {
                          ...(prev?.tugasFungsi || {}),
                          tugas: e.target.value
                        }
                      }))}
                      placeholder="Masukkan rumusan tugas pokok..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 leading-relaxed focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                    />
                  </div>

                  {/* Fungsi Pengawasan */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#063a69]">
                        <FileCheck className="w-4 h-4 text-[#fbae17]" />
                        <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Fungsi-Fungsi Pengawasan</h3>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        {(profileForm?.tugasFungsi?.fungsi || []).length} Butir Fungsi
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(profileForm?.tugasFungsi?.fungsi || []).map((fungsiItem, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                          <span className="w-6 h-6 rounded-full bg-[#063a69] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                            {idx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={fungsiItem}
                            onChange={(e) => {
                              const updated = [...(profileForm?.tugasFungsi?.fungsi || [])];
                              updated[idx] = e.target.value;
                              setProfileForm(prev => ({
                                ...prev,
                                tugasFungsi: { ...(prev?.tugasFungsi || {}), fungsi: updated }
                              }));
                            }}
                            className="flex-1 p-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#063a69]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (profileForm?.tugasFungsi?.fungsi || []).filter((_, i) => i !== idx);
                              setProfileForm(prev => ({
                                ...prev,
                                tugasFungsi: { ...(prev?.tugasFungsi || {}), fungsi: updated }
                              }));
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                            title="Hapus Butir Fungsi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Input Tambah Fungsi Baru */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={newFungsiText}
                        onChange={(e) => setNewFungsiText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newFungsiText.trim()) {
                              setProfileForm(prev => ({
                                ...prev,
                                tugasFungsi: {
                                  ...(prev?.tugasFungsi || {}),
                                  fungsi: [...(prev?.tugasFungsi?.fungsi || []), newFungsiText.trim()]
                                }
                              }));
                              setNewFungsiText('');
                            }
                          }
                        }}
                        placeholder="Tulis butir fungsi baru..."
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#063a69] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newFungsiText.trim()) return;
                          setProfileForm(prev => ({
                            ...prev,
                            tugasFungsi: {
                              ...(prev?.tugasFungsi || {}),
                              fungsi: [...(prev?.tugasFungsi?.fungsi || []), newFungsiText.trim()]
                            }
                          }));
                          setNewFungsiText('');
                        }}
                        className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#fbae17]" />
                        <span>Tambah Fungsi</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveProfile()}
                      disabled={savingProfile}
                      className="px-5 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#fbae17]" />
                      <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Tugas & Fungsi'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. SUB-TAB CORE VALUES */}
              {profileSubTab === 'core-values' && (
                <div className="space-y-6">
                  {/* Pengawasan Berdampak */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-[#063a69]">
                      <Award className="w-4 h-4 text-[#fbae17]" />
                      <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Arah Transformasi Berdampak</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Judul / Slogan</label>
                      <input
                        type="text"
                        value={profileForm?.coreValues?.berdampak?.judul || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          coreValues: {
                            ...(prev?.coreValues || {}),
                            berdampak: { ...(prev?.coreValues?.berdampak || {}), judul: e.target.value }
                          }
                        }))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#063a69]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Narasi</label>
                      <textarea
                        rows={3}
                        value={profileForm?.coreValues?.berdampak?.deskripsi || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          coreValues: {
                            ...(prev?.coreValues || {}),
                            berdampak: { ...(prev?.coreValues?.berdampak || {}), deskripsi: e.target.value }
                          }
                        }))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 7 Nilai ASN BerAKHLAK */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2 text-[#063a69]">
                      <Award className="w-4 h-4 text-[#fbae17]" />
                      <h3 className="font-heading font-bold text-sm uppercase tracking-wider">7 Nilai Dasar ASN (BerAKHLAK)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {(profileForm?.coreValues?.berakhlak || []).map((val, idx) => (
                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-7 h-7 rounded-lg bg-[#063a69] text-[#fbae17] font-bold text-xs flex items-center justify-center">
                              {val.kode}
                            </span>
                            <span className="font-heading font-bold text-xs text-[#063a69]">
                              {val.nama}
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            value={val.desc}
                            onChange={(e) => {
                              const updated = [...(profileForm?.coreValues?.berakhlak || [])];
                              updated[idx] = { ...updated[idx], desc: e.target.value };
                              setProfileForm(prev => ({
                                ...prev,
                                coreValues: { ...(prev?.coreValues || {}), berakhlak: updated }
                              }));
                            }}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#063a69]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveProfile()}
                      disabled={savingProfile}
                      className="px-5 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#fbae17]" />
                      <span>{savingProfile ? 'Menyimpan...' : 'Simpan Core Values'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. SUB-TAB LOGO & FILOSOFI */}
              {profileSubTab === 'logo-lambang' && (
                <div className="space-y-6">
                  {/* Lambang Kemendagri */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-3">
                      <img src="/assets/logo-kemendagri.png" alt="" className="w-8 h-8 object-contain" />
                      <h3 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider">
                        Makna Lambang Kementerian Dalam Negeri
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Umum Lambang</label>
                      <textarea
                        rows={2}
                        value={profileForm?.lambangMakna?.kemendagri?.deskripsi || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          lambangMakna: {
                            ...(prev?.lambangMakna || {}),
                            kemendagri: { ...(prev?.lambangMakna?.kemendagri || {}), deskripsi: e.target.value }
                          }
                        }))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">Butir-Butir Filosofi Unsur Lambang</label>
                      {(profileForm?.lambangMakna?.kemendagri?.filosofi || []).map((filo, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#fbae17] flex-shrink-0" />
                          <input
                            type="text"
                            value={filo}
                            onChange={(e) => {
                              const updated = [...(profileForm?.lambangMakna?.kemendagri?.filosofi || [])];
                              updated[idx] = e.target.value;
                              setProfileForm(prev => ({
                                ...prev,
                                lambangMakna: {
                                  ...(prev?.lambangMakna || {}),
                                  kemendagri: { ...(prev?.lambangMakna?.kemendagri || {}), filosofi: updated }
                                }
                              }));
                            }}
                            className="flex-1 text-xs text-slate-700 bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (profileForm?.lambangMakna?.kemendagri?.filosofi || []).filter((_, i) => i !== idx);
                              setProfileForm(prev => ({
                                ...prev,
                                lambangMakna: {
                                  ...(prev?.lambangMakna || {}),
                                  kemendagri: { ...(prev?.lambangMakna?.kemendagri || {}), filosofi: updated }
                                }
                              }));
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newFilosofiKemendagri}
                          onChange={(e) => setNewFilosofiKemendagri(e.target.value)}
                          placeholder="Tambah butir filosofi baru Kemendagri..."
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFilosofiKemendagri.trim()) return;
                            setProfileForm(prev => ({
                              ...prev,
                              lambangMakna: {
                                ...(prev?.lambangMakna || {}),
                                kemendagri: {
                                  ...(prev?.lambangMakna?.kemendagri || {}),
                                  filosofi: [...(prev?.lambangMakna?.kemendagri?.filosofi || []), newFilosofiKemendagri.trim()]
                                }
                              }
                            }));
                            setNewFilosofiKemendagri('');
                          }}
                          className="px-3 py-2 bg-[#063a69] text-white text-xs font-semibold rounded-xl"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lambang Anggaraksa Dharma */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-3">
                      <img src="/assets/logo-anggaraksa.png" alt="" className="w-8 h-8 object-contain" />
                      <h3 className="font-heading font-bold text-sm text-[#063a69] uppercase tracking-wider">
                        Makna Semboyan & Lambang "Angga Raksa Dharma"
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Semboyan</label>
                      <textarea
                        rows={2}
                        value={profileForm?.lambangMakna?.anggaraksaDharma?.deskripsi || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          lambangMakna: {
                            ...(prev?.lambangMakna || {}),
                            anggaraksaDharma: { ...(prev?.lambangMakna?.anggaraksaDharma || {}), deskripsi: e.target.value }
                          }
                        }))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">Butir-Butir Filosofi Anggaraksa Dharma</label>
                      {(profileForm?.lambangMakna?.anggaraksaDharma?.filosofi || []).map((filo, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#063a69] flex-shrink-0" />
                          <input
                            type="text"
                            value={filo}
                            onChange={(e) => {
                              const updated = [...(profileForm?.lambangMakna?.anggaraksaDharma?.filosofi || [])];
                              updated[idx] = e.target.value;
                              setProfileForm(prev => ({
                                ...prev,
                                lambangMakna: {
                                  ...(prev?.lambangMakna || {}),
                                  anggaraksaDharma: { ...(prev?.lambangMakna?.anggaraksaDharma || {}), filosofi: updated }
                                }
                              }));
                            }}
                            className="flex-1 text-xs text-slate-700 bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (profileForm?.lambangMakna?.anggaraksaDharma?.filosofi || []).filter((_, i) => i !== idx);
                              setProfileForm(prev => ({
                                ...prev,
                                lambangMakna: {
                                  ...(prev?.lambangMakna || {}),
                                  anggaraksaDharma: { ...(prev?.lambangMakna?.anggaraksaDharma || {}), filosofi: updated }
                                }
                              }));
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={newFilosofiAnggaraksa}
                          onChange={(e) => setNewFilosofiAnggaraksa(e.target.value)}
                          placeholder="Tambah butir filosofi baru Anggaraksa Dharma..."
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFilosofiAnggaraksa.trim()) return;
                            setProfileForm(prev => ({
                              ...prev,
                              lambangMakna: {
                                ...(prev?.lambangMakna || {}),
                                anggaraksaDharma: {
                                  ...(prev?.lambangMakna?.anggaraksaDharma || {}),
                                  filosofi: [...(prev?.lambangMakna?.anggaraksaDharma?.filosofi || []), newFilosofiAnggaraksa.trim()]
                                }
                              }
                            }));
                            setNewFilosofiAnggaraksa('');
                          }}
                          className="px-3 py-2 bg-[#063a69] text-white text-xs font-semibold rounded-xl"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveProfile()}
                      disabled={savingProfile}
                      className="px-5 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#fbae17]" />
                      <span>{savingProfile ? 'Menyimpan...' : 'Simpan Filosofi Logo'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KELOLA BERITA */}
          {activeTab === 'berita' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Berita & Informasi
                  </h2>
                  <p className="text-xs text-slate-500">Kelola rilis berita organik pengawasan dan re-upload Kemendagri / Nasional.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berita berdasarkan judul atau kategori..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                />
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-heading font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Gambar</th>
                      <th className="p-3.5">Judul Berita</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Tanggal</th>
                      <th className="p-3.5">Hero Banner</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(dbData?.news || [])
                      .filter(n => !searchTerm || n.judul.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 w-16">
                            <img src={item.gambar} alt="" className="w-14 h-9 object-cover rounded-lg border shadow-xs" />
                          </td>
                          <td className="p-3.5 font-bold text-slate-800 max-w-xs truncate">
                            {item.judul}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-[#063a69] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap">{item.tanggal}</td>
                          <td className="p-3.5">
                            {item.isBanner ? (
                              <span className="text-[10px] bg-[#fbae17]/20 text-[#d48f05] font-bold px-2 py-0.5 rounded border border-[#fbae17]/40">
                                Aktif Hero
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Standar</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => openModal('edit', item)}
                              className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('berita', item.id)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA PEJABAT (HANYA FOTO, NAMA, JABATAN SESUAI PERMINTAAN) */}
          {activeTab === 'pejabat' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Profil Pejabat Utama
                  </h2>
                  <p className="text-xs text-slate-500">Kelola foto, nama lengkap, dan jabatan susunan pimpinan Inspektorat Jenderal.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Pejabat Baru</span>
                </button>
              </div>

              {/* Grid Kartu Pejabat di Admin persis seperti tampilan pengguna */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(dbData?.officers || []).map((off) => (
                  <div
                    key={off.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Foto Pejabat */}
                      <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#132d4b] to-[#1c4472] aspect-[4/4.5] flex items-end justify-center shadow-inner">
                        <img
                          src={off.foto || '/assets/officer-arief.png'}
                          alt={off.nama}
                          className="w-full h-full object-cover object-bottom"
                        />
                      </div>

                      {/* Info: Cukup Nama dan Jabatan */}
                      <div className="pt-3 pb-1">
                        <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                          {off.nama}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                          {off.jabatan}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal('edit', off)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#063a69] hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('pejabat', off.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA MEDIA (CRUDS LENGKAP: CREATE, READ, UPDATE, DELETE, SEARCH) */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Media (CRUDS)
                  </h2>
                  <p className="text-xs text-slate-500">Kelola foto dokumentasi, video liputan, dan infografis pengawasan secara lengkap.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Media Baru</span>
                </button>
              </div>

              {/* Subtabs Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setMediaSubTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                      mediaSubTab === 'all'
                        ? 'bg-[#063a69] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Semua Media ({totalMediaCount})
                  </button>
                  <button
                    onClick={() => setMediaSubTab('photos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                      mediaSubTab === 'photos'
                        ? 'bg-[#063a69] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Foto ({allPhotos.length})
                  </button>
                  <button
                    onClick={() => setMediaSubTab('videos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                      mediaSubTab === 'videos'
                        ? 'bg-[#063a69] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Video ({allVideos.length})
                  </button>
                  <button
                    onClick={() => setMediaSubTab('infographics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                      mediaSubTab === 'infographics'
                        ? 'bg-[#063a69] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    Infografis ({allInfographics.length})
                  </button>
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari media..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                  />
                </div>
              </div>

              {/* Grid Kartu Media dengan CRUDS Aksi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMediaList.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Thumbnail */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={m.url || '/assets/photo-rakornas.jpg'}
                          alt={m.judul}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                            m.mediaType === 'videos' 
                              ? 'bg-red-600 text-white' 
                              : m.mediaType === 'infographics' 
                              ? 'bg-[#063a69] text-[#fbae17]' 
                              : 'bg-black/60 text-white'
                          }`}>
                            {m.mediaType === 'videos' ? 'Video' : m.mediaType === 'infographics' ? 'Infografis' : 'Foto'}
                          </span>
                        </div>
                      </div>

                      {/* Info: Hanya Tanggal dan Judul */}
                      <div className="p-4 space-y-1">
                        <div className="text-xs text-slate-500 font-medium">{m.tanggal}</div>
                        <h4 className="font-heading font-bold text-sm text-[#063a69] line-clamp-2">
                          {m.judul}
                        </h4>
                      </div>
                    </div>

                    {/* CRUDS Aksi: Edit & Hapus */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {m.id}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openModal('edit', m)}
                          className="px-2.5 py-1 bg-white hover:bg-[#063a69] hover:text-white border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete('media', m.id, m.mediaType)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMediaList.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Tidak ada item media ditemukan.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: KELOLA 38 PROVINSI */}
          {activeTab === 'daerah' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Direktori 38 Provinsi
                  </h2>
                  <p className="text-xs text-slate-500">Kelola tautan website resmi, nama inspektur, dan kontak daerah.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Daerah Baru</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari provinsi atau inspektur..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-heading font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Provinsi & Ibukota</th>
                      <th className="p-3.5">Wilayah</th>
                      <th className="p-3.5">Nama Inspektur</th>
                      <th className="p-3.5">Tautan Website</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(dbData?.inspectorates || [])
                      .filter(i => !searchTerm || i.nama.toLowerCase().includes(searchTerm.toLowerCase()) || i.inspektur.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5 font-bold text-slate-800">
                            <div>{item.nama}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Ibukota: {item.ibukota}</div>
                          </td>
                          <td className="p-3.5 text-slate-500">{item.wilayah}</td>
                          <td className="p-3.5 text-slate-700">{item.inspektur}</td>
                          <td className="p-3.5 text-[#063a69] truncate max-w-[200px]">
                            <a href={item.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center space-x-1">
                              <span className="truncate">{item.website}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => openModal('edit', item)}
                              className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('daerah', item.id)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: KELOLA REGULASI */}
          {activeTab === 'regulasi' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Regulasi & Produk Hukum
                  </h2>
                  <p className="text-xs text-slate-500">Kelola Permendagri, Kepmendagri, dan Surat Edaran (SE).</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Regulasi Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-heading font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Jenis</th>
                      <th className="p-3.5">Nomor Peraturan</th>
                      <th className="p-3.5">Tahun</th>
                      <th className="p-3.5">Tentang / Perihal</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(dbData?.regulations || []).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="p-3.5 font-bold text-[#063a69]">{r.jenis}</td>
                        <td className="p-3.5 font-bold text-slate-800">{r.nomor}</td>
                        <td className="p-3.5 text-slate-500">{r.tahun}</td>
                        <td className="p-3.5 text-slate-700 max-w-xs truncate">{r.tentang}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                            {r.status || 'Berlaku'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openModal('edit', r)}
                            className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('regulasi', r.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: KELOLA LAYANAN & INFO PUBLIK */}
          {activeTab === 'layanan' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Manajemen Layanan & Informasi Publik
                  </h2>
                  <p className="text-xs text-slate-500">Kelola IHP, Renstra, Renja, RKP, Aplikasi Publik Siola/SP4N/SIPD, dan Konfigurasi WBS.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Item Layanan</span>
                </button>
              </div>

              {/* Layanan Publik List */}
              <div className="space-y-3">
                <div className="font-heading font-bold text-xs uppercase text-slate-400">Daftar Aplikasi & Layanan Publik:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(dbData?.services?.layananPublik || []).map((lay) => (
                    <div key={lay.id} className="p-4 bg-slate-50 border rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="font-heading font-bold text-xs text-[#063a69]">{lay.nama}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{lay.deskripsi}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openModal('edit', { ...lay, section: 'layananPublik' })}
                          className="p-1.5 text-slate-500 hover:text-[#063a69] rounded-lg"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('layanan', lay.id, 'layananPublik')}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dokumen Info Publik */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="font-heading font-bold text-xs uppercase text-slate-400">Dokumen Informasi Publik:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(dbData?.services?.informasiPublik || []).map((inf) => (
                    <div key={inf.id} className="p-4 bg-slate-50 border rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="font-heading font-bold text-xs text-[#063a69]">{inf.kode} - {inf.judul}</div>
                        <div className="text-[11px] text-slate-500">{inf.periode} &bull; {inf.fileSize}</div>
                      </div>
                      <button
                        onClick={() => handleDelete('layanan', inf.id, 'informasiPublik')}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MODERASI PENILAIAN & SKM */}
          {activeTab === 'penilaian' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-heading font-extrabold text-2xl text-[#063a69]">
                  Moderasi Masukan Penilaian Pengguna & SKM
                </h2>
                <p className="text-xs text-slate-500">Tinjau ulasan rating website publik dan hasil pengisian Survei Kepuasan Masyarakat.</p>
              </div>

              {/* Data Rating Pengguna */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase text-slate-400">
                  Ulasan & Rating Website Masuk:
                </h3>
                <div className="space-y-2.5">
                  {(dbData?.ratings || []).map((r) => (
                    <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-bold text-xs text-[#063a69]">{r.nama}</span>
                          <span className="text-[10px] text-slate-400">({r.instansi || 'Masyarakat'})</span>
                          <span className="text-[10px] text-slate-400">&bull; {r.tanggal}</span>
                          <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {r.rating} / 5 Bintang
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{r.ulasan}"</p>
                      </div>
                      <button
                        onClick={() => handleDelete('rating', r.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data SKM Masuk */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-heading font-bold text-xs uppercase text-slate-400">
                  Respon Survei Kepuasan Masyarakat:
                </h3>
                <div className="space-y-2.5">
                  {(dbData?.skmResponses || []).map((skm) => (
                    <div key={skm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-bold text-xs text-[#063a69]">{skm.nama}</span>
                          <span className="text-[10px] text-slate-400">({skm.instansi})</span>
                          <span className="text-[10px] text-slate-400">&bull; {skm.tanggal}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Akses: {skm.kemudahanAkses}/5 | Info: {skm.kejelasanInformasi}/5 | Respons: {skm.kecepatanLayanan}/5 | Kualitas: {skm.kualitasLayanan}/5
                        </div>
                        {skm.saran && <p className="text-xs text-slate-700">Saran: "{skm.saran}"</p>}
                      </div>
                      <button
                        onClick={() => handleDelete('skm', skm.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Hapus Data SKM"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. MODAL CRUD MULTIGUNA UNTUK SEMUA ENTITAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="bg-[#063a69] text-white p-5 px-6 flex items-center justify-between border-b-2 border-[#fbae17]">
              <div>
                <h3 className="font-heading font-extrabold text-base text-white">
                  {modalMode === 'create' ? 'Tambah Data Baru' : 'Edit Data'} — {activeTab.toUpperCase()}
                </h3>
                <p className="text-[11px] text-slate-300">Lengkapi data berikut untuk disimpan ke basis data terpusat.</p>
              </div>
              <button onClick={closeModal} className="p-1 text-slate-300 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content Scrollable */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* FORM UNTUK BERITA */}
              {activeTab === 'berita' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Judul Berita *</label>
                    <input
                      type="text"
                      value={formData.judul || ''}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                      placeholder="Masukkan judul berita..."
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs focus:ring-2 focus:ring-[#063a69]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Kategori *</label>
                      <select
                        value={formData.kategori || 'pengawasan'}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      >
                        <option value="pengawasan">Berita Pengawasan (Organik Itjen)</option>
                        <option value="kemendagri">Berita Kemendagri (Re-upload)</option>
                        <option value="nasional">Berita Nasional (Re-upload)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Tanggal Rilis</label>
                      <input
                        type="date"
                        value={formData.tanggal || ''}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Penulis / Sumber Rilis</label>
                    <input
                      type="text"
                      value={formData.penulis || ''}
                      onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Foto Tajuk Berita (URL atau Unggah)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.gambar || ''}
                        onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                        className="flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                      <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl cursor-pointer flex items-center space-x-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'gambar')}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Konten Lengkap Berita *</label>
                    <textarea
                      rows={5}
                      value={formData.konten || ''}
                      onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="isBanner"
                      checked={formData.isBanner || false}
                      onChange={(e) => setFormData({ ...formData, isBanner: e.target.checked })}
                      className="w-4 h-4 accent-[#063a69]"
                    />
                    <label htmlFor="isBanner" className="font-semibold text-slate-700">
                      Tampilkan sebagai Headline Banner Landscape di Beranda
                    </label>
                  </div>
                </>
              )}

              {/* FORM UNTUK PEJABAT: CUKUP FOTO, NAMA, JABATAN */}
              {activeTab === 'pejabat' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Arief Tri Hardiyanto"
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Jabatan *</label>
                    <input
                      type="text"
                      value={formData.jabatan || ''}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      placeholder="Contoh: INSPEKTUR JENDERAL"
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Foto Pejabat (URL atau Unggah File)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.foto || ''}
                        onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                        placeholder="/assets/officer-..."
                        className="flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                      <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl cursor-pointer flex items-center space-x-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'foto')}
                        />
                      </label>
                    </div>

                    {formData.foto && (
                      <div className="mt-3 flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <img src={formData.foto} alt="Preview" className="w-12 h-14 object-cover rounded-lg border" />
                        <span className="text-[11px] text-slate-500">Pratinjau foto terpilih</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* FORM UNTUK MEDIA (CRUDS FOTO, VIDEO, INFOGRAFIS) */}
              {activeTab === 'media' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Jenis Media *</label>
                      <select
                        value={formData.mediaType || 'photos'}
                        onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                      >
                        <option value="photos">Foto Dokumentasi</option>
                        <option value="videos">Video Liputan</option>
                        <option value="infographics">Infografis Edukasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Tanggal *</label>
                      <input
                        type="date"
                        value={formData.tanggal || ''}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Judul Media *</label>
                    <input
                      type="text"
                      value={formData.judul || ''}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                      placeholder="Masukkan judul media..."
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  {formData.mediaType === 'videos' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">YouTube Video ID</label>
                        <input
                          type="text"
                          value={formData.youtubeId || ''}
                          onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                          placeholder="Contoh: dQw4w9WgXcQ"
                          className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Masukkan ID video YouTube (misal dari https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">File Gambar (URL atau Unggah File)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.url || ''}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          placeholder="/assets/... atau URL"
                          className="flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs"
                        />
                        <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl cursor-pointer flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'url')}
                          />
                        </label>
                      </div>

                      {formData.url && (
                        <div className="mt-3 flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                          <img src={formData.url} alt="Preview" className="w-16 h-12 object-cover rounded-lg border" />
                          <span className="text-[11px] text-slate-500">Pratinjau gambar terpilih</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* FORM UNTUK INSPEKTORAT DAERAH */}
              {activeTab === 'daerah' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Nama Provinsi *</label>
                      <input
                        type="text"
                        value={formData.nama || ''}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Ibukota</label>
                      <input
                        type="text"
                        value={formData.ibukota || ''}
                        onChange={(e) => setFormData({ ...formData, ibukota: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Zona Wilayah</label>
                      <select
                        value={formData.wilayah || 'Sumatera'}
                        onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      >
                        <option value="Sumatera">Sumatera</option>
                        <option value="Jawa">Jawa</option>
                        <option value="Bali & Nusa Tenggara">Bali & Nusa Tenggara</option>
                        <option value="Kalimantan">Kalimantan</option>
                        <option value="Sulawesi">Sulawesi</option>
                        <option value="Maluku & Papua">Maluku & Papua</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        value={formData.telp || ''}
                        onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Inspektur Daerah</label>
                    <input
                      type="text"
                      value={formData.inspektur || ''}
                      onChange={(e) => setFormData({ ...formData, inspektur: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">URL Website Resmi Inspektorat *</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://inspektorat.prov.go.id"
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>
                </>
              )}

              {/* FORM UNTUK REGULASI */}
              {activeTab === 'regulasi' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Jenis Peraturan *</label>
                      <select
                        value={formData.jenis || 'Permendagri'}
                        onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                      >
                        <option value="Permendagri">Permendagri</option>
                        <option value="Kepmendagri">Kepmendagri</option>
                        <option value="SE">Surat Edaran (SE)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Nomor *</label>
                      <input
                        type="text"
                        value={formData.nomor || ''}
                        onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                        placeholder="Nomor 137 Tahun 2022"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Tahun *</label>
                      <input
                        type="text"
                        value={formData.tahun || '2026'}
                        onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Tentang / Perihal *</label>
                    <textarea
                      rows={3}
                      value={formData.tentang || ''}
                      onChange={(e) => setFormData({ ...formData, tentang: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                      <input
                        type="text"
                        value={formData.status || 'Berlaku'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Ukuran File</label>
                      <input
                        type="text"
                        value={formData.ukuranFile || '2.5 MB'}
                        onChange={(e) => setFormData({ ...formData, ukuranFile: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FORM UNTUK LAYANAN */}
              {activeTab === 'layanan' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Bagian Layanan *</label>
                      <select
                        value={formData.section || 'layananPublik'}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      >
                        <option value="layananPublik">Layanan Publik (Aplikasi)</option>
                        <option value="informasiPublik">Informasi Publik (Dokumen)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Kode Singkat</label>
                      <input
                        type="text"
                        value={formData.kode || ''}
                        onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                        placeholder="Contoh: SIOLA / IHP"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Layanan / Dokumen *</label>
                    <input
                      type="text"
                      value={formData.nama || formData.judul || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value, judul: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">URL Akses / Tautan</label>
                    <input
                      type="text"
                      value={formData.url || formData.fileUrl || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value, fileUrl: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={3}
                      value={formData.deskripsi || ''}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Footer Tombol Modal */}
              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center space-x-2 shadow-md"
                >
                  <Save className="w-3.5 h-3.5 text-[#fbae17]" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
