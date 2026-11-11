import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { loginAdmin } from '../api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Silakan masukkan username/email dan kata sandi.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin(username.trim(), password.trim());
      if (res.success) {
        onLoginSuccess(res.user || { 
          username: username.trim(), 
          email: username.includes('@') ? username.trim() : 'humas@gmail.com',
          role: 'admin' 
        });
        onClose();
      } else {
        setError(res.message || 'Username atau password tidak sesuai.');
      }
    } catch (err) {
      setError('Terjadi kendala saat menghubungkan ke sistem autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Container Split-Screen sesuai Desain Figma */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[620px]">
        
        {/* Tombol Tutup Modal di Pojok Kanan Atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Tutup Halaman Login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SISI KIRI (50% DESKTOP): BRANDED HERO LANDSCAPE DENGAN DUAL LOGO */}
        <div className="lg:col-span-6 relative overflow-hidden bg-gradient-to-br from-[#042646] via-[#063a69] to-[#0a4f8f] text-white p-8 sm:p-12 flex flex-col justify-between">
          {/* Latar Belakang Citra Arsitektur & Garis Cahaya */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url('/assets/photo-hall.jpg')" }}
          />

          {/* Dual Logo Resmi: Kemendagri & Anggaraksa Dharma */}
          <div className="relative z-10 flex items-center space-x-4">
            <img
              src="/assets/logo-kemendagri.png"
              alt="Kementerian Dalam Negeri"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow"
            />
            <div className="w-px h-10 bg-white/30"></div>
            <img
              src="/assets/logo-anggaraksa.png"
              alt="Anggaraksa Dharma"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow"
            />
          </div>

          {/* Konten Hero Kiri */}
          <div className="relative z-10 my-8 space-y-4">
            <span className="text-[10px] sm:text-xs font-heading font-bold text-[#fbae17] tracking-widest uppercase bg-white/10 px-3 py-1 rounded-md inline-block">
              INSPEKTORAT JENDERAL KEMENDAGRI
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight drop-shadow-md">
              Pengawasan yang profesional, akuntabel, dan berintegritas.
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow">
              Mengawal jalannya roda pemerintahan dalam negeri demi terciptanya tata kelola yang bersih, transparan, dan berdaya saing bagi kemakmuran masyarakat.
            </p>
          </div>

          {/* Watermark Lambang & Hak Cipta */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/15 pt-4">
            <span>Portal Sistem Informasi Manajemen Humas</span>
            <span className="font-semibold text-[#fbae17]">APIP Berintegritas</span>
          </div>

          {/* Watermark Lambang Anggaraksa di pojok kanan bawah */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <img src="/assets/logo-anggaraksa.png" alt="" className="w-64 h-64" />
          </div>
        </div>

        {/* SISI KANAN (50% DESKTOP): FORM LOGIN ADMIN EKSEKUTIF */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header Form */}
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-heading font-bold tracking-wider text-[#063a69] uppercase bg-[#f4f2ee] px-3 py-1 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#fbae17]"></span>
                <span>Portal Administrator Khusus</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#063a69] mt-3">
                Login Admin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Silakan masukkan kredensial untuk mengelola portal resmi Inspektorat Jenderal.
              </p>
            </div>

            {/* Alert Pesan Kesalahan */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-700 text-xs leading-relaxed animate-fadeIn">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Username atau Email */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase mb-1.5">
                  Username atau Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username atau email..."
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69] focus:bg-white transition-all text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#063a69] focus:bg-white transition-all text-slate-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Row Ingat Saya & Bantuan */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#063a69] accent-[#063a69]"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk bantuan akses kredensial akun administrator, silakan hubungi Subbagian Tata Usaha & Humas Itjen Kemendagri.')}
                  className="text-slate-500 hover:text-[#063a69] transition-colors"
                >
                  Bantuan Masuk?
                </button>
              </div>

              {/* Tombol Submit Masuk ke Dashboard */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#063a69] hover:bg-[#042646] active:scale-[0.99] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 text-[#fbae17] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>

          {/* Footer Card: Tombol Kembali ke Beranda */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center space-y-2">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-[#063a69] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Publik</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
