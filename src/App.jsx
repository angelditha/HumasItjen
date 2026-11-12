import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import Home from './pages/Home';
import Profile from './pages/Profile';
import News from './pages/News';
import Media from './pages/Media';
import Inspectorates from './pages/Inspectorates';
import Regulations from './pages/Regulations';
import Services from './pages/Services';
import AdminDashboard from './admin/AdminDashboard';
import { fetchAllData } from './api';
import {
  parsePathToState,
  getPathForState,
  findNewsBySlug,
  applySeoMeta,
  normalizeSubPage
} from './utils/routes';
import { Search, X, ArrowRight, ExternalLink, FileText, Newspaper, Building2 } from 'lucide-react';

export default function App() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialRoute =
    typeof window !== 'undefined'
      ? parsePathToState(window.location.pathname)
      : { page: 'beranda', subPage: null, newsSlug: null };

  // Navigation states synced with URL slug
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [activeSubPage, setActiveSubPage] = useState(initialRoute.subPage);
  const [pendingNewsSlug, setPendingNewsSlug] = useState(initialRoute.newsSlug);
  const [selectedNews, setSelectedNews] = useState(null);

  // Admin states
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('humas_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Media Modal state for Home
  const [mediaModalItem, setMediaModalItem] = useState(null);

  // Fetch initial data
  const loadData = async () => {
    try {
      const data = await fetchAllData();
      if (data) {
        setDbData(data);
      }
    } catch (err) {
      console.error('Error loading db:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    localStorage.setItem('humas_admin_user', JSON.stringify(user));
    setIsAdminView(true);
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('humas_admin_user');
    setIsAdminView(false);
  };

  const handleNavigate = (page, subPage = null, newsItem = null, options = { pushHistory: true }) => {
    const normalizedSub = normalizeSubPage(page, subPage);
    setActivePage(page);
    setActiveSubPage(normalizedSub);
    setSelectedNews(newsItem || null);
    setPendingNewsSlug(null);

    if (typeof window !== 'undefined' && options?.pushHistory !== false) {
      const targetPath = getPathForState(page, normalizedSub, newsItem);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page, subPage: normalizedSub }, '', targetPath);
      }
    }

    applySeoMeta(page, normalizedSub, newsItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve news detail slug once data loads
  useEffect(() => {
    if (pendingNewsSlug && dbData?.news?.length) {
      const matchedNews = findNewsBySlug(dbData.news, pendingNewsSlug);
      if (matchedNews) {
        setSelectedNews(matchedNews);
      }
      setPendingNewsSlug(null);
    }
  }, [pendingNewsSlug, dbData]);

  // Sync browser back/forward navigation with state
  useEffect(() => {
    const onPopState = () => {
      const route = parsePathToState(window.location.pathname);
      setActivePage(route.page);
      setActiveSubPage(route.subPage);
      if (route.newsSlug && dbData?.news?.length) {
        setSelectedNews(findNewsBySlug(dbData.news, route.newsSlug));
        setPendingNewsSlug(null);
      } else {
        setSelectedNews(null);
        setPendingNewsSlug(route.newsSlug || null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [dbData]);

  // Update dynamic SEO meta tags on state change
  useEffect(() => {
    applySeoMeta(activePage, activeSubPage, selectedNews);
  }, [activePage, activeSubPage, selectedNews]);

  // Search results
  const searchResultsNews = (dbData?.news || []).filter(n =>
    searchQuery.trim() && (
      n.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.ringkasan?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 4);

  const searchResultsRegs = (dbData?.regulations || []).filter(r =>
    searchQuery.trim() && (
      r.nomor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tentang?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 4);

  const searchResultsProv = (dbData?.inspectorates || []).filter(p =>
    searchQuery.trim() && (
      p.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ibukota?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 4);

  // If loading and no fallback data
  if (loading && !dbData) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-3">
          <img src="/assets/logo-kemendagri.png" alt="" className="h-12 w-auto animate-pulse" />
          <img src="/assets/logo-anggaraksa.png" alt="" className="h-12 w-auto animate-pulse" />
        </div>
        <p className="font-heading font-bold text-sm text-[#063a69] tracking-wider uppercase">
          Memuat Portal Inspektorat Jenderal Kemendagri...
        </p>
      </div>
    );
  }

  // POV ADMIN VIEW
  if (isAdminView && adminUser) {
    return (
      <AdminDashboard
        dbData={dbData}
        adminUser={adminUser}
        onLogout={handleLogout}
        onSwitchToPublic={() => setIsAdminView(false)}
        onRefreshData={loadData}
      />
    );
  }

  // POV PENGGUNA (PUBLIC VIEW)
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f2ee] font-body selection:bg-[#fbae17]/30 selection:text-[#063a69]">
      {/* NAVBAR RESMI */}
      <Navbar
        activePage={activePage}
        setActivePage={(p) => handleNavigate(p, null)}
        activeSubPage={activeSubPage}
        setActiveSubPage={(sub) => handleNavigate(activePage, sub)}
        onNavigate={handleNavigate}
        adminUser={adminUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenDashboard={() => setIsAdminView(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      {/* MAIN CONTENT ROUTER */}
      <main className="flex-1">
        {activePage === 'beranda' && (
          <Home
            dbData={dbData}
            onNavigate={handleNavigate}
            onSelectNews={(newsItem) => handleNavigate('berita', null, newsItem)}
            onOpenMediaModal={(type, item) => setMediaModalItem({ ...item, type })}
            onRefreshData={loadData}
          />
        )}

        {activePage === 'profil' && (
          <Profile
            dbData={dbData}
            activeSubPage={activeSubPage}
            setActiveSubPage={(sub) => handleNavigate('profil', sub)}
          />
        )}

        {activePage === 'berita' && (
          <News
            dbData={dbData}
            activeSubPage={activeSubPage}
            setActiveSubPage={(sub) => handleNavigate('berita', sub)}
            selectedNews={selectedNews}
            setSelectedNews={(newsItem) =>
              newsItem
                ? handleNavigate('berita', null, newsItem)
                : handleNavigate('berita', activeSubPage, null)
            }
          />
        )}

        {activePage === 'media' && (
          <Media
            dbData={dbData}
            activeSubPage={activeSubPage}
            setActiveSubPage={(sub) => handleNavigate('media', sub)}
          />
        )}

        {activePage === 'inspektorat-daerah' && (
          <Inspectorates
            dbData={dbData}
          />
        )}

        {activePage === 'regulasi' && (
          <Regulations
            dbData={dbData}
            activeSubPage={activeSubPage}
            setActiveSubPage={(sub) => handleNavigate('regulasi', sub)}
          />
        )}

        {activePage === 'layanan' && (
          <Services
            dbData={dbData}
            activeSubPage={activeSubPage}
            setActiveSubPage={(sub) => handleNavigate('layanan', sub)}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* FOOTER RESMI */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        adminUser={adminUser}
        onOpenDashboard={() => setIsAdminView(true)}
      />

      {/* MODAL LOGIN ADMIN RAHASIA (TIDAK MENAMPILKAN KREDENSIAL) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* GLOBAL SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Search Header */}
            <div className="p-4 bg-[#063a69] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5 flex-1 pr-4">
                <Search className="w-5 h-5 text-[#fbae17]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci pencarian (misal: APBD, WBS, Permendagri, Jawa Barat)..."
                  className="w-full bg-transparent text-white placeholder-slate-300 text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs">
              {!searchQuery.trim() ? (
                <div className="text-center py-8 text-slate-400">
                  Ketik kata kunci untuk mencari seluruh konten berita, regulasi, dan 38 provinsi.
                </div>
              ) : (
                <>
                  {/* Berita Results */}
                  {searchResultsNews.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-heading font-bold text-xs uppercase text-slate-400 flex items-center space-x-1.5">
                        <Newspaper className="w-3.5 h-3.5 text-[#fbae17]" />
                        <span>Berita & Informasi:</span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResultsNews.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              handleNavigate('berita', null, n);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-heading font-bold text-xs text-[#063a69] group-hover:text-[#d48f05]">{n.judul}</div>
                              <div className="text-[10px] text-slate-500">{n.tanggal} &bull; {n.kategori}</div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#063a69]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regulasi Results */}
                  {searchResultsRegs.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-heading font-bold text-xs uppercase text-slate-400 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#fbae17]" />
                        <span>Regulasi & Produk Hukum:</span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResultsRegs.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => {
                              const sub =
                                r.jenis === 'Permendagri'
                                  ? 'reg-permendagri'
                                  : r.jenis === 'Kepmendagri'
                                  ? 'reg-kepmendagri'
                                  : r.jenis === 'SE'
                                  ? 'reg-se'
                                  : null;
                              handleNavigate('regulasi', sub);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-heading font-bold text-xs text-[#063a69]">{r.nomor} ({r.jenis})</div>
                              <div className="text-[10px] text-slate-600 line-clamp-1">{r.tentang}</div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#063a69]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provinsi Results */}
                  {searchResultsProv.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-heading font-bold text-xs uppercase text-slate-400 flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#fbae17]" />
                        <span>Inspektorat Daerah:</span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResultsProv.map((p) => (
                          <a
                            key={p.id}
                            href={p.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between group"
                          >
                            <div className="min-w-0 pr-3">
                              <div className="font-heading font-bold text-xs text-[#063a69]">{p.nama}</div>
                              <div className="text-[10px] text-slate-500 truncate">{p.website}</div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#063a69] flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResultsNews.length === 0 && searchResultsRegs.length === 0 && searchResultsProv.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      Tidak ditemukan hasil untuk "{searchQuery}".
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW MODAL FOR HOME */}
      {mediaModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
            <div className="bg-[#063a69] text-white p-4 px-5 sm:px-6 flex items-start justify-between gap-3 flex-shrink-0">
              <h3 className="font-heading font-bold text-sm sm:text-base text-white break-words whitespace-normal flex-1 min-w-0 leading-snug">
                {mediaModalItem.judul}
              </h3>
              <button
                onClick={() => setMediaModalItem(null)}
                className="p-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/15 transition-colors flex-shrink-0"
                title="Tutup"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center flex-1 min-h-0 overflow-auto">
              {mediaModalItem.type === 'video' ? (
                <div className="w-full aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${mediaModalItem.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1`}
                    title={mediaModalItem.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img
                  src={mediaModalItem.url}
                  alt={mediaModalItem.judul}
                  className="max-h-[58vh] w-auto object-contain mx-auto"
                />
              )}
            </div>

            <div className="p-4 px-5 sm:px-6 bg-white border-t border-slate-200 flex-shrink-0">
              <div className="text-xs text-slate-500 font-medium">
                {mediaModalItem.tanggal}
              </div>
              <div className="font-heading font-bold text-sm text-[#063a69] break-words leading-snug">
                {mediaModalItem.judul}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
