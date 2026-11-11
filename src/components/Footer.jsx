import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  FileText, 
  ExternalLink, 
  Lock, 
  Globe2, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function Footer({ onNavigate, onOpenLogin, adminUser, onOpenDashboard }) {
  return (
    <footer className="bg-[#042646] text-white border-t-4 border-[#fbae17] pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Kolom 1: Identitas & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo-kemendagri.png" 
                alt="Logo Kemendagri" 
                className="h-12 w-auto object-contain"
              />
              <div className="h-8 w-px bg-white/20"></div>
              <img 
                src="/assets/logo-anggaraksa.png" 
                alt="Logo Inspektorat" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white tracking-wide">
                INSPEKTORAT JENDERAL
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                Kementerian Dalam Negeri Republik Indonesia
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              Aparat Pengawasan Intern Pemerintah (APIP) yang bertugas menyelenggarakan pengawasan intern di lingkungan Kemendagri dan pembinaan serta pengawasan umum pelaksanaan urusan pemerintahan daerah di seluruh Indonesia.
            </p>
            <div className="pt-1">
              <span className="inline-block bg-[#fbae17]/20 text-[#fbae17] border border-[#fbae17]/40 text-[11px] font-semibold px-2.5 py-1 rounded">
                Semboyan: Angga Raksa Dharma
              </span>
            </div>
          </div>

          {/* Kolom 2: Kontak & Kantor */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#fbae17] uppercase tracking-wider">
              Kantor & Kontak Resmi
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#fbae17] flex-shrink-0 mt-0.5" />
                <span>
                  Gedung B Lantai 2-5, Jl. Medan Merdeka Utara No. 7, Gambir, Jakarta Pusat 10110
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#fbae17] flex-shrink-0" />
                <span>(021) 3450038 / (021) 3840650</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#fbae17] flex-shrink-0" />
                <span>humas.itjen@kemendagri.go.id</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-[#fbae17] flex-shrink-0" />
                <span>pengaduan.itjen@kemendagri.go.id</span>
              </div>
              <div className="flex items-start space-x-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#fbae17] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Jam Layanan Publik:</div>
                  <div>Senin - Kamis: 08.00 - 16.00 WIB</div>
                  <div>Jumat: 08.00 - 16.30 WIB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 3: Tautan Cepat Menu */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#fbae17] uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('profil', 'visi-misi')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Visi, Misi & Sasaran Strategis</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('profil', 'logo-lambang')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Filosofi Lambang Anggaraksa Dharma</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('profil', 'profil-pejabat')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Profil Pimpinan & Pejabat Itjen</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('berita', 'berita-pengawasan')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Rilis Berita Pengawasan Itjen</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('inspektorat-daerah')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>38 Inspektorat Daerah Provinsi</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('regulasi')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Regulasi Permendagri & SE</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('layanan', 'layanan-skm')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Survei Kepuasan Masyarakat</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('beranda', 'rating')}
                  className="hover:text-[#fbae17] transition-colors flex items-center space-x-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#fbae17]" />
                  <span>Penilaian Kualitas Website</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kanal Layanan Terpadu & Sinergi */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#fbae17] uppercase tracking-wider">
              Kanal Layanan Terpadu
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href="https://otda.kemendagri.go.id/layananwbs" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#fbae17]" />
                  <span className="font-semibold">Whistleblowing System (WBS)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              <a 
                href="https://sipd.kemendagri.go.id" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <Globe2 className="w-4 h-4 text-[#fbae17]" />
                  <span className="font-semibold">SIPD RI Kemendagri</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              <a 
                href="https://www.lapor.go.id" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#fbae17]" />
                  <span className="font-semibold">SP4N LAPOR! Nasional</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              <a 
                href="https://ppid.kemendagri.go.id" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-between text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#fbae17]" />
                  <span className="font-semibold">Portal PPID Kemendagri</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500 text-[11px]">Versi Portal 2.4.0</span>
            <span className="text-slate-600">|</span>
            {adminUser ? (
              <button
                onClick={onOpenDashboard}
                className="text-[#fbae17] hover:underline font-semibold flex items-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Panel Pengelola Humas Aktif</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-slate-500 hover:text-slate-300 hover:underline flex items-center space-x-1 transition-colors"
                title="Akses Petugas Humas"
              >
                <Lock className="w-3 h-3" />
                <span>Akses Pengelola Humas</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
