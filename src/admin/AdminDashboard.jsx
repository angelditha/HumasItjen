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
  ChevronDown,
  Target,
  Award,
  FileCheck,
  Landmark,
  Download
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
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { downloadDocument, formatFileSize, isDocumentAvailable } from '../utils/documentHelper';

export default function AdminDashboard({ 
  dbData, 
  adminUser,
  adminRoute,
  onAdminNavigate,
  onLogout, 
  onSwitchToPublic,
  onRefreshData 
}) {
  const [activeTab, setActiveTab] = useState(adminRoute?.tab || 'ringkasan');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  // Media, Berita, Regulasi, Layanan sub-tabs in Admin Sidebar
  const [mediaSubTab, setMediaSubTab] = useState(
    adminRoute?.tab === 'media' && adminRoute?.subTab ? adminRoute.subTab : 'all'
  );
  const [newsSubTab, setNewsSubTab] = useState(
    adminRoute?.tab === 'berita' && adminRoute?.subTab ? adminRoute.subTab : 'all'
  );
  const [regSubTab, setRegSubTab] = useState(
    adminRoute?.tab === 'regulasi' && adminRoute?.subTab ? adminRoute.subTab : 'all'
  );
  const [layananSubTab, setLayananSubTab] = useState(
    adminRoute?.tab === 'layanan' && adminRoute?.subTab ? adminRoute.subTab : 'informasiPublik'
  );
  const [expandedMenu, setExpandedMenu] = useState(adminRoute?.expandedMenu || null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentEntity, setCurrentEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Profile management states
  const [profileSubTab, setProfileSubTab] = useState(
    adminRoute?.tab === 'profil' && adminRoute?.subTab ? adminRoute.subTab : 'visi-misi'
  );

  // Sync admin state when browser Back/Forward or external adminRoute changes
  useEffect(() => {
    if (!adminRoute) return;
    setActiveTab(adminRoute.tab || 'ringkasan');
    setExpandedMenu(adminRoute.expandedMenu || null);
    if (adminRoute.tab === 'profil' && adminRoute.subTab) setProfileSubTab(adminRoute.subTab);
    if (adminRoute.tab === 'berita') setNewsSubTab(adminRoute.subTab || 'all');
    if (adminRoute.tab === 'media') setMediaSubTab(adminRoute.subTab || 'all');
    if (adminRoute.tab === 'regulasi') setRegSubTab(adminRoute.subTab || 'all');
    if (adminRoute.tab === 'layanan') setLayananSubTab(adminRoute.subTab || 'informasiPublik');
  }, [adminRoute]);

  const navigateAdmin = (tab, subTab = null, nextExpanded = null) => {
    setActiveTab(tab);
    setExpandedMenu(nextExpanded);
    if (tab === 'profil' && subTab) setProfileSubTab(subTab);
    if (tab === 'berita') setNewsSubTab(subTab || 'all');
    if (tab === 'media') setMediaSubTab(subTab || 'all');
    if (tab === 'regulasi') setRegSubTab(subTab || 'all');
    if (tab === 'layanan') setLayananSubTab(subTab || 'informasiPublik');
    setSearchTerm('');
    if (onAdminNavigate) {
      onAdminNavigate(tab, subTab, nextExpanded);
    }
  };
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

  const handleFileUpload = async (e, fieldName, options = {}) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.success) {
        const readableSize = formatFileSize(res.size || file.size);
        setFormData(prev => {
          const next = { ...prev, [fieldName]: res.url };
          if (options.sizeField && readableSize) {
            next[options.sizeField] = readableSize;
          }
          if (options.nameField && (res.originalName || res.filename || file.name)) {
            next[options.nameField] = res.originalName || res.filename || file.name;
          }
          return next;
        });
        showToast('File berhasil diunggah: ' + (res.originalName || res.filename || file.name));
      }
    } catch (err) {
      alert(err?.message || 'Gagal mengunggah file. Pastikan server aktif dan ukuran file sesuai.');
    } finally {
      setUploading(false);
    }
  };

  // Open modal
  const openModal = (mode, entity = null, overrideTab = null) => {
    const targetTab = overrideTab || activeTab;
    setModalMode(mode);
    setCurrentEntity(entity);
    if (mode === 'edit' && entity) {
      setFormData({ ...entity });
    } else {
      // Default blank values based on target tab
      if (targetTab === 'berita') {
        setFormData({
          judul: '',
          kategori: newsSubTab !== 'all' ? newsSubTab : 'pengawasan',
          tanggal: new Date().toISOString().split('T')[0],
          penulis: 'Tim Humas Itjen Kemendagri',
          gambar: '/assets/photo-hall.jpg',
          konten: '',
          isBanner: false
        });
      } else if (targetTab === 'pejabat') {
        // Cukup foto, nama, jabatan!
        setFormData({
          nama: '',
          jabatan: '',
          foto: '/assets/officer-arief.png',
          urutan: (dbData?.officers?.length || 0) + 1
        });
      } else if (targetTab === 'media') {
        // Full CRUDS media form
        setFormData({
          mediaType: mediaSubTab !== 'all' ? mediaSubTab : 'photos',
          judul: '',
          tanggal: new Date().toISOString().split('T')[0],
          url: '/assets/photo-rakornas.jpg',
          youtubeId: 'dQw4w9WgXcQ'
        });
      } else if (targetTab === 'daerah') {
        setFormData({
          nama: '',
          website: 'https://inspektorat.'
        });
      } else if (targetTab === 'regulasi') {
        setFormData({
          jenis: regSubTab !== 'all' ? regSubTab : 'Permendagri',
          nomor: '',
          tahun: '2026',
          tentang: '',
          tanggalDitetapkan: new Date().toISOString().split('T')[0],
          status: 'Berlaku',
          fileUrl: '',
          ukuranFile: ''
        });
      } else if (targetTab === 'layanan') {
        const targetSection = entity?.section || (layananSubTab === 'layananPublik' ? 'layananPublik' : 'informasiPublik');
        if (targetSection === 'informasiPublik') {
          setFormData({
            section: 'informasiPublik',
            kategori: '2. RINGKASAN INFORMASI PROGRAM DAN KEGIATAN ITJEN KEMENDAGRI',
            nomor: '',
            kode: '',
            judul: '',
            periode: 'Tahun 2026',
            deskripsi: '',
            fileUrl: '',
            fileSize: ''
          });
        } else {
          setFormData({
            section: 'layananPublik',
            nama: '',
            deskripsi: '',
            url: 'https://',
            kategori: 'Pengawasan',
            badge: 'Resmi Itjen'
          });
        }
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
        let payload;
        if (section === 'informasiPublik') {
          payload = {
            kategori: formData.kategori || '1. INFORMASI TENTANG HASIL PENGAWASAN',
            nomor: formData.nomor || '',
            kode: formData.kode || '',
            judul: formData.judul || formData.nama || '',
            periode: formData.periode || 'Tahun 2026',
            deskripsi: formData.deskripsi || '',
            fileUrl: formData.fileUrl || formData.url || '',
            fileSize: formData.fileSize || 'PDF'
          };
        } else {
          payload = {
            nama: formData.nama || formData.judul || '',
            deskripsi: formData.deskripsi || '',
            url: formData.url || formData.fileUrl || '',
            kategori: formData.kategori || 'Pengawasan',
            badge: formData.badge || formData.kategori || 'Resmi Kemendagri'
          };
        }
        if (modalMode === 'create') {
          await createService(section, payload);
          showToast(section === 'informasiPublik' ? 'Dokumen Informasi Publik berhasil ditambahkan.' : 'Layanan baru berhasil ditambahkan.');
        } else {
          await updateService(section, currentEntity.id, payload);
          showToast(section === 'informasiPublik' ? 'Dokumen Informasi Publik berhasil diperbarui.' : 'Layanan berhasil diperbarui.');
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
    {
      id: 'profil',
      label: 'Kelola Profil Institusi',
      icon: Landmark,
      children: [
        { id: 'visi-misi', label: 'Visi & Misi', targetTab: 'profil' },
        { id: 'logo-lambang', label: 'Logo & Filosofi', targetTab: 'profil' },
        { id: 'core-values', label: 'Core Value BerAKHLAK', targetTab: 'profil' },
        { id: 'struktur-organisasi', label: 'Struktur Organisasi', targetTab: 'profil' },
        { id: 'tugas-fungsi', label: 'Tugas & Fungsi', targetTab: 'profil' },
        { id: 'pejabat', label: 'Profil Pejabat', targetTab: 'pejabat', count: dbData?.officers?.length },
      ],
    },
    {
      id: 'berita',
      label: 'Kelola Berita',
      icon: Newspaper,
      count: dbData?.news?.length,
      children: [
        { id: 'all', label: 'Semua Berita', targetTab: 'berita' },
        { id: 'nasional', label: 'Berita Nasional', targetTab: 'berita' },
        { id: 'kemendagri', label: 'Berita Kemendagri', targetTab: 'berita' },
        { id: 'pengawasan', label: 'Berita Pengawasan', targetTab: 'berita' },
      ],
    },
    {
      id: 'media',
      label: 'Kelola Media (CRUDS)',
      icon: ImageIcon,
      count: totalMediaCount,
      children: [
        { id: 'all', label: 'Semua Media', targetTab: 'media', count: totalMediaCount },
        { id: 'photos', label: 'Foto', targetTab: 'media', count: allPhotos.length },
        { id: 'videos', label: 'Video', targetTab: 'media', count: allVideos.length },
        { id: 'infographics', label: 'Infografis', targetTab: 'media', count: allInfographics.length },
      ],
    },
    { id: 'daerah', label: 'Kelola Inspektorat 38 Provinsi', icon: Building2, count: dbData?.inspectorates?.length },
    {
      id: 'regulasi',
      label: 'Kelola Regulasi',
      icon: FileText,
      count: dbData?.regulations?.length,
      children: [
        { id: 'all', label: 'Semua Regulasi', targetTab: 'regulasi' },
        { id: 'Permendagri', label: 'Permendagri', targetTab: 'regulasi' },
        { id: 'Kepmendagri', label: 'Kepmendagri', targetTab: 'regulasi' },
        { id: 'SE', label: 'Surat Edaran (SE)', targetTab: 'regulasi' },
      ],
    },
    {
      id: 'layanan',
      label: 'Kelola Layanan & Info Publik',
      icon: Globe2,
      children: [
        { id: 'informasiPublik', label: 'Informasi Publik', targetTab: 'layanan', count: dbData?.services?.informasiPublik?.length },
        { id: 'layananPublik', label: 'Layanan Publik', targetTab: 'layanan', count: dbData?.services?.layananPublik?.length },
        { id: 'penilaian', label: 'SKM & Penilaian Publik', targetTab: 'penilaian', count: (dbData?.ratings?.length || 0) + (dbData?.skmResponses?.length || 0) },
      ],
    },
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
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isParentActive =
                activeTab === item.id ||
                (item.id === 'profil' && activeTab === 'pejabat') ||
                (item.id === 'layanan' && activeTab === 'penilaian');
              const isExpanded = expandedMenu === item.id;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        setExpandedMenu((prev) => (prev === item.id ? null : item.id));
                      } else {
                        navigateAdmin(item.id, null, null);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-heading font-semibold transition-all ${
                      isParentActive
                        ? 'bg-[#063a69] text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-[#063a69]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isParentActive ? 'text-[#fbae17]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {item.count !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isParentActive ? 'bg-[#fbae17] text-[#063a69]' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${isParentActive ? 'text-[#fbae17]' : 'text-slate-400'}`}
                        />
                      )}
                    </div>
                  </button>

                  {hasChildren && isExpanded && (
                    <div className="ml-4 pl-3 border-l-2 border-slate-200 space-y-0.5 py-1">
                      {item.children.map((sub) => {
                        const isSubActive =
                          (sub.targetTab === 'pejabat' && activeTab === 'pejabat') ||
                          (sub.targetTab === 'penilaian' && activeTab === 'penilaian') ||
                          (item.id === 'profil' && sub.targetTab === 'profil' && activeTab === 'profil' && profileSubTab === sub.id) ||
                          (item.id === 'berita' && activeTab === 'berita' && newsSubTab === sub.id) ||
                          (item.id === 'media' && activeTab === 'media' && mediaSubTab === sub.id) ||
                          (item.id === 'regulasi' && activeTab === 'regulasi' && regSubTab === sub.id) ||
                          (item.id === 'layanan' && sub.targetTab === 'layanan' && activeTab === 'layanan' && layananSubTab === sub.id);

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              const targetTab = sub.targetTab || item.id;
                              const nextSubTab =
                                targetTab === 'pejabat' || targetTab === 'penilaian' ? null : sub.id;
                              navigateAdmin(targetTab, nextSubTab, item.id);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-heading font-semibold transition-all text-left ${
                              isSubActive
                                ? 'bg-[#063a69]/10 text-[#063a69] border-l-2 border-[#fbae17]'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-[#063a69]'
                            }`}
                          >
                            <span>{sub.label}</span>
                            {sub.count !== undefined && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                isSubActive ? 'bg-[#063a69] text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {sub.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                    onClick={() => { navigateAdmin('berita', 'all', 'berita'); openModal('create', null, 'berita'); }}
                    className="px-4 py-2 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#fbae17]" />
                    <span>Tambah Berita Baru</span>
                  </button>
                  <button
                    onClick={() => { navigateAdmin('pejabat', null, 'profil'); openModal('create', null, 'pejabat'); }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#063a69] border border-slate-300 text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d48f05]" />
                    <span>Tambah Pejabat Baru</span>
                  </button>
                  <button
                    onClick={() => { navigateAdmin('media', 'all', 'media'); openModal('create', null, 'media'); }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-[#063a69] border border-slate-300 text-xs font-heading font-semibold rounded-lg flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d48f05]" />
                    <span>Unggah Media Baru</span>
                  </button>
                  <button
                    onClick={() => { navigateAdmin('regulasi', 'all', 'regulasi'); openModal('create', null, 'regulasi'); }}
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
                    {{
                      'visi-misi': 'Profil Institusi - Visi & Misi',
                      'struktur-organisasi': 'Profil Institusi - Struktur Organisasi',
                      'tugas-fungsi': 'Profil Institusi - Tugas & Fungsi',
                      'core-values': 'Profil Institusi - Core Value BerAKHLAK',
                      'logo-lambang': 'Profil Institusi - Logo & Filosofi',
                    }[profileSubTab] || 'Manajemen Profil Institusi'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih sub-bagian profil di menu samping kiri untuk mengubah Visi & Misi, Bagan Struktur Organisasi, Tugas & Fungsi, Core Value BerAKHLAK, atau Filosofi Lambang.
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
                    {{
                      all: 'Manajemen Berita & Informasi - Semua Berita',
                      nasional: 'Manajemen Berita - Berita Nasional',
                      kemendagri: 'Manajemen Berita - Berita Kemendagri',
                      pengawasan: 'Manajemen Berita - Berita Pengawasan',
                    }[newsSubTab] || 'Manajemen Berita & Informasi'}
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
                      .filter(n => (newsSubTab === 'all' || n.kategori === newsSubTab) && (!searchTerm || n.judul.toLowerCase().includes(searchTerm.toLowerCase())))
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
                    {{
                      all: 'Manajemen Media (CRUDS) - Semua Media',
                      photos: 'Manajemen Media - Galeri Foto',
                      videos: 'Manajemen Media - Video Liputan',
                      infographics: 'Manajemen Media - Infografis',
                    }[mediaSubTab] || 'Manajemen Media (CRUDS)'}
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

              {/* Search Bar Media */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari media foto, video, atau infografis..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                />
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
                        <h4 className="font-heading font-bold text-sm text-[#063a69] break-words leading-snug">
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
                  <p className="text-xs text-slate-500">Kelola daftar nama daerah dan tautan website eksternal resmi Inspektorat Daerah.</p>
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
                  placeholder="Cari nama daerah atau tautan website..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-heading font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Nama Daerah / Provinsi</th>
                      <th className="p-3.5">Tautan Website Eksternal</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(dbData?.inspectorates || [])
                      .filter(i => !searchTerm || i.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || i.website?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5 font-bold text-[#063a69]">
                            {item.nama}
                          </td>
                          <td className="p-3.5 text-[#063a69] max-w-[320px]">
                            <a href={item.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center space-x-1.5">
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-[#063a69]" />
                              <span className="truncate">{item.website}</span>
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
                    {{
                      all: 'Manajemen Regulasi & Produk Hukum - Semua Regulasi',
                      Permendagri: 'Manajemen Regulasi - Permendagri',
                      Kepmendagri: 'Manajemen Regulasi - Kepmendagri',
                      SE: 'Manajemen Regulasi - Surat Edaran (SE)',
                    }[regSubTab] || 'Manajemen Regulasi & Produk Hukum'}
                  </h2>
                  <p className="text-xs text-slate-500">Kelola Permendagri, Kepmendagri, Surat Edaran (SE), dan unggah dokumen salinan resmi.</p>
                </div>

                <button
                  onClick={() => openModal('create')}
                  className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fbae17]" />
                  <span>Tambah Regulasi Baru</span>
                </button>
              </div>

              {/* Search Bar Regulasi */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nomor peraturan, jenis, tahun, atau tentang..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69]"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-heading font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Jenis</th>
                      <th className="p-3.5">Nomor Peraturan</th>
                      <th className="p-3.5">Tahun</th>
                      <th className="p-3.5">Tentang / Perihal</th>
                      <th className="p-3.5">Dokumen Resmi</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(dbData?.regulations || [])
                      .filter(r => (regSubTab === 'all' || r.jenis === regSubTab) && (!searchTerm || r.nomor?.toLowerCase().includes(searchTerm.toLowerCase()) || r.tentang?.toLowerCase().includes(searchTerm.toLowerCase()) || r.jenis?.toLowerCase().includes(searchTerm.toLowerCase()) || String(r.tahun).includes(searchTerm)))
                      .map((r) => {
                        const hasFile = isDocumentAvailable(r.fileUrl || r.url);
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/80">
                            <td className="p-3.5 font-bold text-[#063a69] whitespace-nowrap">{r.jenis}</td>
                            <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">{r.nomor}</td>
                            <td className="p-3.5 text-slate-500">{r.tahun}</td>
                            <td className="p-3.5 text-slate-700 max-w-xs truncate" title={r.tentang}>{r.tentang}</td>
                            <td className="p-3.5 whitespace-nowrap">
                              {hasFile ? (
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewDoc({
                                      ...r,
                                      title: r.tentang || r.nomor,
                                      subtitle: `${r.jenis} ${r.nomor}`.trim(),
                                      fileUrl: r.fileUrl || r.url,
                                      ukuranFile: r.ukuranFile,
                                      tanggalDitetapkan: r.tanggalDitetapkan,
                                      downloadName: `${r.jenis}-${r.nomor}`
                                    })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#063a69] rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                                    title="Buka dokumen tanpa mengunduh"
                                  >
                                    <Eye className="w-3 h-3 text-[#d48f05]" />
                                    <span>Buka</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadDocument(r.fileUrl || r.url, `${r.jenis}-${r.nomor}`)}
                                    className="px-2 py-1 bg-[#063a69]/10 hover:bg-[#063a69]/20 text-[#063a69] rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                                    title="Unduh file dokumen"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>{r.ukuranFile || 'Unduh'}</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                                  Belum ada file
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                                {r.status || 'Berlaku'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                              <button
                                onClick={() => openModal('edit', r)}
                                className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                                title="Edit Regulasi & Dokumen"
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
                        );
                      })}
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
                    {layananSubTab === 'layananPublik'
                      ? 'Manajemen Layanan Publik'
                      : 'Manajemen Dokumen Informasi Publik'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {layananSubTab === 'layananPublik'
                      ? 'Kelola daftar aplikasi dan kanal layanan publik Itjen Kemendagri.'
                      : 'Kelola dokumen resmi Informasi Publik beserta berkas PDF untuk pratinjau dan unduhan publik.'}
                  </p>
                </div>

                {layananSubTab === 'layananPublik' ? (
                  <button
                    onClick={() => openModal('create', { section: 'layananPublik' })}
                    className="px-4 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#fbae17]" />
                    <span>Tambah Aplikasi Layanan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openModal('create', { section: 'informasiPublik' })}
                    className="px-4 py-2.5 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] text-xs font-heading font-bold uppercase rounded-xl flex items-center space-x-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Dokumen Info Publik</span>
                  </button>
                )}
              </div>

              {/* Dokumen Info Publik (Tampilan Berkelompok seperti Referensi Publik) */}
              {layananSubTab === 'informasiPublik' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-xs uppercase text-slate-500">
                    Dokumen Informasi Publik (Dapat Dibuka & Diunduh Publik):
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Total: {(dbData?.services?.informasiPublik || []).length} dokumen
                  </span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                  {Array.from(
                    (dbData?.services?.informasiPublik || []).reduce((acc, item) => {
                      const group = (item.kategori || 'DOKUMEN INFORMASI PUBLIK').trim();
                      if (!acc.has(group)) acc.set(group, []);
                      acc.get(group).push(item);
                      return acc;
                    }, new Map()).entries()
                  ).map(([groupTitle, items], groupIdx) => (
                    <div key={groupTitle} className="p-4 sm:p-5 space-y-2">
                      <div className="font-heading font-bold text-xs sm:text-sm text-[#063a69] uppercase tracking-wide">
                        {groupTitle}
                      </div>
                      <div className="ml-2 sm:ml-4 border-l border-slate-300 space-y-1.5">
                        {items.map((inf, itemIdx) => {
                          const hasFile = isDocumentAvailable(inf.fileUrl || inf.url);
                          const nomorItem = inf.nomor || `${groupIdx + 1}.${itemIdx + 1}.`;
                          return (
                            <div
                              key={inf.id}
                              className="relative pl-5 sm:pl-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 rounded-r-lg transition-colors"
                            >
                              <span className="absolute left-0 top-1/2 w-3.5 h-px bg-slate-300"></span>
                              <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                                <span className="text-xs font-bold text-slate-800 min-w-[32px]">{nomorItem}</span>
                                <span className="font-semibold text-xs text-[#063a69] break-words">
                                  {inf.judul || inf.nama}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                  {inf.kode || 'DOK'}
                                </span>
                                {hasFile ? (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                                    File Tersedia
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                                    Belum ada file
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-1 flex-shrink-0 pl-7 sm:pl-0">
                                {hasFile && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setPreviewDoc({
                                        ...inf,
                                        title: inf.judul || inf.nama,
                                        subtitle: inf.kode || 'Informasi Publik',
                                        fileUrl: inf.fileUrl || inf.url,
                                        fileSize: inf.fileSize,
                                        periode: inf.periode,
                                        downloadName: `${inf.kode || 'Dokumen'}-${inf.judul || inf.nama || inf.id}`
                                      })}
                                      className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                                      title="Buka Dokumen"
                                    >
                                      <Eye className="w-4 h-4 text-[#d48f05]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => downloadDocument(inf.fileUrl || inf.url, `${inf.kode || 'Dokumen'}-${inf.judul || inf.nama || inf.id}`)}
                                      className="px-2.5 py-1 bg-[#ebc163] hover:bg-[#e0b24b] text-white rounded-md text-[11px] font-semibold flex items-center space-x-1"
                                      title="Download Dokumen"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Download</span>
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openModal('edit', { ...inf, section: 'informasiPublik' })}
                                  className="p-1.5 text-slate-600 hover:text-[#063a69] hover:bg-slate-200 rounded-lg"
                                  title="Edit Dokumen Informasi Publik"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete('layanan', inf.id, 'informasiPublik')}
                                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Layanan Publik List */}
              {layananSubTab === 'layananPublik' && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="font-heading font-bold text-xs uppercase text-slate-400">Daftar Aplikasi & Layanan Publik:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(dbData?.services?.layananPublik || []).map((lay) => (
                    <div key={lay.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start justify-between gap-3 shadow-2xs">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-bold text-xs text-[#063a69]">{lay.nama}</span>
                          {(lay.badge || lay.kategori) && (
                            <span className="text-[10px] font-semibold text-[#063a69] bg-slate-100 px-2 py-0.5 rounded">
                              {lay.badge || lay.kategori}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2">{lay.deskripsi}</div>
                        {lay.url && (
                          <div className="text-[10px] text-slate-400 truncate">{lay.url}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
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
              )}
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
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Daerah / Provinsi *</label>
                    <input
                      type="text"
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Jawa Barat"
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">URL Website Eksternal Resmi *</label>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      placeholder="Tuliskan perihal peraturan atau surat edaran..."
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Tanggal Ditetapkan</label>
                      <input
                        type="date"
                        value={formData.tanggalDitetapkan || ''}
                        onChange={(e) => setFormData({ ...formData, tanggalDitetapkan: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>

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
                        value={formData.ukuranFile || ''}
                        onChange={(e) => setFormData({ ...formData, ukuranFile: e.target.value })}
                        placeholder="Contoh: 1.5 MB"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Dokumen Resmi / Surat (Unggah PDF/Word/Scan atau URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={(formData.fileUrl || '').startsWith('data:') ? `[File terunggah: ${formData.namaFile || 'Dokumen Resmi'}]` : (formData.fileUrl || '')}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        placeholder="/documents/... atau https://... atau klik Unggah File"
                        readOnly={(formData.fileUrl || '').startsWith('data:')}
                        className="flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs"
                      />
                      <label className="px-3.5 py-2 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] font-bold rounded-xl cursor-pointer flex items-center space-x-1.5 whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? 'Mengunggah...' : 'Unggah File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'fileUrl', { sizeField: 'ukuranFile', nameField: 'namaFile' })}
                        />
                      </label>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      <span className="text-[11px] text-slate-500">
                        Mendukung PDF, DOC/DOCX, XLS/XLSX, atau scan surat (JPG/PNG).
                      </span>
                      {isDocumentAvailable(formData.fileUrl) && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({
                              title: formData.tentang || formData.nomor || 'Pratinjau Regulasi',
                              subtitle: `${formData.jenis || ''} ${formData.nomor || ''}`.trim(),
                              fileUrl: formData.fileUrl,
                              ukuranFile: formData.ukuranFile,
                              tanggalDitetapkan: formData.tanggalDitetapkan,
                              downloadName: `${formData.jenis || 'Regulasi'}-${formData.nomor || 'Dokumen'}`
                            })}
                            className="text-[11px] font-bold text-[#063a69] hover:underline flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d48f05]" />
                            <span>Pratinjau Dokumen</span>
                          </button>
                          {(formData.fileUrl || '').startsWith('data:') && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fileUrl: '', namaFile: '' })}
                              className="text-[11px] font-semibold text-red-600 hover:underline"
                            >
                              Hapus Lampiran
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* FORM UNTUK LAYANAN */}
              {activeTab === 'layanan' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Bagian Layanan *</label>
                    <select
                      value={formData.section || 'layananPublik'}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      disabled={modalMode === 'edit'}
                      className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold disabled:opacity-75"
                    >
                      <option value="informasiPublik">Informasi Publik (Dokumen Resmi)</option>
                      <option value="layananPublik">Layanan Publik (Aplikasi Digital)</option>
                    </select>
                  </div>

                  {formData.section === 'informasiPublik' ? (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Kode Singkat *</label>
                        <input
                          type="text"
                          value={formData.kode || ''}
                          onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                          placeholder="Contoh: IHP / Renstra / LKjIP"
                          className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 uppercase mb-1">Kelompok / Kategori Informasi *</label>
                          <input
                            type="text"
                            list="kategori-infopub-list"
                            value={formData.kategori || ''}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            placeholder="Contoh: 2. RINGKASAN INFORMASI PROGRAM DAN KEGIATAN ITJEN KEMENDAGRI"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                            required
                          />
                          <datalist id="kategori-infopub-list">
                            {Array.from(new Set([
                              '1. INFORMASI TENTANG HASIL PENGAWASAN',
                              '2. RINGKASAN INFORMASI PROGRAM DAN KEGIATAN ITJEN KEMENDAGRI',
                              ...(dbData?.services?.informasiPublik || []).map(i => i.kategori).filter(Boolean)
                            ])).map((kat) => (
                              <option key={kat} value={kat} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Urut</label>
                          <input
                            type="text"
                            value={formData.nomor || ''}
                            onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                            placeholder="Contoh: 2.1."
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 uppercase mb-1">Judul Dokumen Informasi Publik *</label>
                          <input
                            type="text"
                            value={formData.judul || formData.nama || ''}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value, nama: e.target.value })}
                            placeholder="Contoh: Ikhtisar Hasil Pengawasan (IHP) Semesteran"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs font-semibold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Periode / Tahun *</label>
                          <input
                            type="text"
                            value={formData.periode || ''}
                            onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                            placeholder="Tahun 2026"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 uppercase mb-1">
                            Dokumen Resmi / Surat (Unggah PDF/Word/Excel atau URL)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={(formData.fileUrl || '').startsWith('data:') ? `[File terunggah: ${formData.fileName || 'Dokumen Informasi Publik'}]` : (formData.fileUrl || formData.url || '')}
                              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value, url: e.target.value })}
                              placeholder="/documents/... atau https://... atau klik Unggah File"
                              readOnly={(formData.fileUrl || '').startsWith('data:')}
                              className="flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs"
                            />
                            <label className="px-3.5 py-2 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] font-bold rounded-xl cursor-pointer flex items-center space-x-1.5 whitespace-nowrap">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploading ? 'Mengunggah...' : 'Unggah File'}</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'fileUrl', { sizeField: 'fileSize', nameField: 'fileName' })}
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Ukuran File</label>
                          <input
                            type="text"
                            value={formData.fileSize || ''}
                            onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                            placeholder="Contoh: 2.4 MB"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          />
                        </div>
                      </div>

                      {isDocumentAvailable(formData.fileUrl || formData.url) && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dokumen terlampir siap dibuka & diunduh publik.</span>
                          </span>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({
                                title: formData.judul || formData.nama || 'Pratinjau Dokumen',
                                subtitle: formData.kode || 'Informasi Publik',
                                fileUrl: formData.fileUrl || formData.url,
                                fileSize: formData.fileSize,
                                periode: formData.periode,
                                downloadName: `${formData.kode || 'Dokumen'}-${formData.judul || 'InfoPublik'}`
                              })}
                              className="text-[11px] font-bold text-[#063a69] hover:underline flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#d48f05]" />
                              <span>Pratinjau</span>
                            </button>
                            {(formData.fileUrl || '').startsWith('data:') && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, fileUrl: '', url: '', fileName: '' })}
                                className="text-[11px] font-semibold text-red-600 hover:underline"
                              >
                                Hapus File
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Dokumen</label>
                        <textarea
                          rows={3}
                          value={formData.deskripsi || ''}
                          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                          placeholder="Ringkasan isi atau fungsi dokumen informasi publik..."
                          className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Nama Aplikasi Layanan *</label>
                        <input
                          type="text"
                          value={formData.nama || formData.judul || ''}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value, judul: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Kategori</label>
                          <input
                            type="text"
                            value={formData.kategori || ''}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            placeholder="Pengawasan Intern"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 uppercase mb-1">Label Badge</label>
                          <input
                            type="text"
                            value={formData.badge || ''}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            placeholder="Resmi Kemendagri"
                            className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">URL Portal / Tautan Aplikasi *</label>
                        <input
                          type="text"
                          value={formData.url || formData.fileUrl || ''}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value, fileUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs"
                          required
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

      {/* Modal Pratinjau Dokumen untuk Admin */}
      <DocumentPreviewModal
        docItem={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
