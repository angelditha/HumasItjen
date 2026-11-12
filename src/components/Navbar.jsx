import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  X,
  Shield,
  Lock,
  Calendar,
  Clock,
  ExternalLink,
  Sliders,
  UserCheck
} from 'lucide-react';
import { getPathForState } from '../utils/routes';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  activeSubPage, 
  setActiveSubPage, 
  onNavigate,
  adminUser, 
  onOpenLogin, 
  onOpenDashboard, 
  onSearchOpen 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [compactDate, setCompactDate] = useState('');

  // Update clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Date in Indonesian
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${dayName}, ${day} ${monthName} ${year}`);
      setCompactDate(`${day} ${shortMonths[now.getMonth()]} ${year}`);

      // Time HH:mm:ss WIB
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} WIB`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (pageId, subPageId = null, event = null) => {
    if (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
        return;
      }
      event.preventDefault();
    }
    if (onNavigate) {
      onNavigate(pageId, subPageId);
    } else {
      setActivePage(pageId);
      setActiveSubPage(subPageId || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    {
      id: 'profil',
      label: 'Profil',
      children: [
        { id: 'visi-misi', label: 'Visi & Misi' },
        { id: 'logo-lambang', label: 'Logo & Lambang' },
        { id: 'core-values', label: 'Core Value BerAKHLAK & Berdampak' },
        { id: 'struktur-organisasi', label: 'Struktur Organisasi' },
        { id: 'tugas-fungsi', label: 'Tugas & Fungsi' },
        { id: 'profil-pejabat', label: 'Profil Pejabat' },
      ]
    },
    {
      id: 'berita',
      label: 'Berita',
      children: [
        { id: 'berita-nasional', label: 'Berita Nasional' },
        { id: 'berita-kemendagri', label: 'Berita Kemendagri' },
        { id: 'berita-pengawasan', label: 'Berita Pengawasan' },
      ]
    },
    {
      id: 'media',
      label: 'Media',
      children: [
        { id: 'media-foto', label: 'Foto' },
        { id: 'media-video', label: 'Video' },
        { id: 'media-infografis', label: 'Infografis' },
      ]
    },
    { id: 'inspektorat-daerah', label: 'Inspektorat Daerah' },
    {
      id: 'regulasi',
      label: 'Regulasi',
      children: [
        { id: 'reg-permendagri', label: 'Permendagri' },
        { id: 'reg-kepmendagri', label: 'Kepmendagri' },
        { id: 'reg-se', label: 'Surat Edaran (SE)' },
      ]
    },
    {
      id: 'layanan',
      label: 'Layanan',
      children: [
        { id: 'informasi-publik', label: 'Informasi Publik' },
        { id: 'layanan-publik', label: 'Layanan Publik' },
        { id: 'layanan-skm', label: 'Survei Kepuasan Masyarakat' },
        { id: 'layanan-wbs', label: 'WBS - Whistleblowing System' },
      ]
    }
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      {/* 1. BRAND HEADER WITH TWO LOGOS */}
      <div className="bg-[#f4f2ee] border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a 
            href="/"
            onClick={(e) => handleNavClick('beranda', null, e)}
            className="flex items-center space-x-3 sm:space-x-5 cursor-pointer group select-none"
          >
            {/* Logo Kemendagri & Logo Inspektorat */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/assets/logo-kemendagri.png" 
                alt="Lambang Kementerian Dalam Negeri RI" 
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
              />
              <div className="h-10 sm:h-12 w-px bg-slate-300"></div>
              <img 
                src="/assets/logo-anggaraksa.png" 
                alt="Lambang Inspektorat Jenderal Kemendagri - Anggaraksa Dharma" 
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105"
              />
            </div>

            {/* Typography Identitas Kementerian */}
            <div>
              <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase">
                Kementerian Dalam Negeri Republik Indonesia
              </div>
              <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-[#063a69] tracking-tight leading-tight group-hover:text-[#042646] transition-colors">
                INSPEKTORAT JENDERAL
              </h1>
            </div>
          </a>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION & UTILITY BAR (SATU BARIS TERPADU) */}
      <nav className="bg-[#063a69] text-white shadow-md relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const isCurrent = activePage === item.id;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <a
                    href={getPathForState(item.id, hasChildren ? item.children[0].id : null)}
                    onClick={(e) => {
                      if (!hasChildren) {
                        handleNavClick(item.id, null, e);
                      } else {
                        handleNavClick(item.id, item.children[0].id, e);
                      }
                    }}
                    className={`px-2 xl:px-2.5 py-3.5 text-[11px] xl:text-xs font-heading font-semibold uppercase tracking-tight xl:tracking-wide flex items-center space-x-1 transition-colors border-b-2 whitespace-nowrap ${
                      isCurrent 
                        ? 'border-[#fbae17] text-[#fbae17] bg-white/5' 
                        : 'border-transparent text-slate-100 hover:text-[#fbae17] hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-80 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {hasChildren && activeDropdown === item.id && (
                    <div className="absolute left-0 top-full w-64 bg-white text-slate-800 rounded-b-lg shadow-xl border-t-2 border-[#fbae17] py-2 z-50 animate-fadeIn">
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={getPathForState(item.id, child.id)}
                          onClick={(e) => handleNavClick(item.id, child.id, e)}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#f4f2ee] hover:text-[#063a69] flex items-center justify-between transition-colors group/subitem ${
                            activePage === item.id && activeSubPage === child.id 
                              ? 'text-[#063a69] font-bold bg-[#f4f2ee]' 
                              : 'text-slate-700'
                          }`}
                        >
                          <span>{child.label}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-all flex-shrink-0 ${
                            activePage === item.id && activeSubPage === child.id 
                              ? 'text-[#063a69] translate-x-0.5' 
                              : 'text-[#d48f05] group-hover/subitem:text-[#063a69] group-hover/subitem:translate-x-0.5'
                          }`} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Utility Cluster (Kalender, Portal WBS, PPID, Kemendagri RI, Portal Humas, Cari) & Mobile Toggle */}
          <div className="flex items-center space-x-1.5 xl:space-x-2 py-1.5 ml-auto">
            {/* Kalender / Tanggal */}
            <div
              className="hidden xl:flex items-center space-x-1 text-[11px] text-slate-200 pr-2 border-r border-white/15 whitespace-nowrap"
              title={`${currentDate} (${currentTime})`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#fbae17] flex-shrink-0" />
              <span className="hidden 2xl:inline">{currentDate}</span>
              <span className="2xl:hidden">{compactDate}</span>
            </div>

            {/* Quick Links Terpadu */}
            <div className="hidden md:flex items-center space-x-1.5 xl:space-x-2 text-[11px] text-slate-200 pr-2 border-r border-white/15 whitespace-nowrap">
              <a
                href="https://otda.kemendagri.go.id/layananwbs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#fbae17] transition-colors inline-flex items-center space-x-1"
                title="Portal Whistleblowing System"
              >
                <Shield className="w-3 h-3 text-[#fbae17]" />
                <span>Portal WBS</span>
              </a>
              <span className="text-white/20">|</span>
              <a
                href="https://ppid.kemendagri.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#fbae17] transition-colors inline-flex items-center"
              >
                <span>PPID</span>
              </a>
              <span className="text-white/20 hidden xl:inline">|</span>
              <a
                href="https://kemendagri.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#fbae17] transition-colors hidden xl:inline-flex items-center space-x-1"
              >
                <span>Kemendagri RI</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Portal Humas / Admin Dashboard */}
            <div className="hidden sm:flex items-center whitespace-nowrap">
              {adminUser ? (
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center space-x-1 bg-[#fbae17] text-[#063a69] hover:bg-[#fec34d] font-bold px-2.5 py-1 rounded text-[11px] shadow-xs transition-all"
                  title="Buka Dashboard Administrasi"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Dashboard Humas</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center space-x-1 text-slate-200 hover:text-[#fbae17] px-2 py-1 rounded hover:bg-white/10 text-[11px] transition-colors"
                  title="Akses Terbatas Pengelola"
                >
                  <Lock className="w-3 h-3 text-[#fbae17]" />
                  <span>Portal Humas</span>
                </button>
              )}
            </div>

            {/* Tombol Cari */}
            <button
              onClick={onSearchOpen}
              className="px-2 py-1.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1.5 text-xs whitespace-nowrap"
              title="Pencarian Cepat"
            >
              <Search className="w-4 h-4 text-[#fbae17]" />
              <span className="hidden sm:inline font-medium text-[11px]">Cari...</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 4. MOBILE MENU ACCORDION */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#042646] border-t border-white/10 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isCurrent = activePage === item.id;

              return (
                <div key={item.id} className="border-b border-white/5 py-1">
                  <div className="flex items-center justify-between">
                    {!hasChildren ? (
                      <a
                        href={getPathForState(item.id)}
                        onClick={(e) => handleNavClick(item.id, null, e)}
                        className={`text-left py-2 text-sm font-heading font-semibold uppercase tracking-wider flex-1 ${
                          isCurrent ? 'text-[#fbae17]' : 'text-slate-200'
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className={`text-left py-2 text-sm font-heading font-semibold uppercase tracking-wider flex-1 ${
                          isCurrent ? 'text-[#fbae17]' : 'text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                    {hasChildren && (
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className="p-2 text-slate-400 hover:text-white"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasChildren && activeDropdown === item.id && (
                    <div className="pl-4 pb-2 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={getPathForState(item.id, child.id)}
                          onClick={(e) => handleNavClick(item.id, child.id, e)}
                          className={`w-full text-left py-2 text-xs flex items-center justify-between transition-colors ${
                            activePage === item.id && activeSubPage === child.id 
                              ? 'text-[#fbae17] font-bold' 
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <span>{child.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-[11px] text-slate-300 pb-1">
                <Calendar className="w-3.5 h-3.5 text-[#fbae17]" />
                <span>{currentDate} ({currentTime})</span>
              </div>
              <a 
                href="https://otda.kemendagri.go.id/layananwbs" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-[#fbae17] font-semibold py-1 flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Portal Whistleblowing System (WBS)</span>
              </a>
              <div className="flex items-center space-x-4 text-xs text-slate-300 py-1">
                <a href="https://ppid.kemendagri.go.id" target="_blank" rel="noreferrer" className="hover:text-[#fbae17]">
                  PPID Kemendagri
                </a>
                <span className="text-white/20">|</span>
                <a href="https://kemendagri.go.id" target="_blank" rel="noreferrer" className="hover:text-[#fbae17] inline-flex items-center space-x-1">
                  <span>Kemendagri RI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {adminUser ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                  className="w-full text-center py-2 bg-[#fbae17] text-[#063a69] font-bold rounded text-xs"
                >
                  Buka Dashboard Humas
                </button>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full text-center py-2 bg-white/10 text-slate-200 hover:bg-white/20 rounded text-xs"
                >
                  Portal Pengelola Humas
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
