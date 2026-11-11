import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Globe2, 
  Shield, 
  ExternalLink, 
  Download, 
  Eye,
  Star, 
  CheckCircle2, 
  Building2, 
  Send, 
  ThumbsUp, 
  HelpCircle,
  FileCheck2,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { submitSkm } from '../api';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { downloadDocument, isDocumentAvailable } from '../utils/documentHelper';

export default function Services({ dbData, activeSubPage, setActiveSubPage, onRefreshData }) {
  const servicesData = dbData?.services || { informasiPublik: [], layananPublik: [], wbs: {} };
  const infoPublik = servicesData.informasiPublik || [];
  const layananPublik = servicesData.layananPublik || [];
  const wbsInfo = servicesData.wbs || {};

  const getTabFromSubPage = (subPage) => (
    subPage === 'layanan-publik'
      ? 'layanan-publik'
      : subPage === 'layanan-skm'
      ? 'layanan-skm'
      : subPage === 'layanan-wbs'
      ? 'layanan-wbs'
      : 'informasi-publik'
  );

  const [activeTab, setActiveTab] = useState(getTabFromSubPage(activeSubPage));
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    setActiveTab(getTabFromSubPage(activeSubPage));
  }, [activeSubPage]);

  // SKM Form State
  const [skmNama, setSkmNama] = useState('');
  const [skmInstansi, setSkmInstansi] = useState('');
  const [skmAkses, setSkmAkses] = useState(5);
  const [skmInfo, setSkmInfo] = useState(5);
  const [skmKecepatan, setSkmKecepatan] = useState(5);
  const [skmKualitas, setSkmKualitas] = useState(5);
  const [skmSaran, setSkmSaran] = useState('');
  const [submittingSkm, setSubmittingSkm] = useState(false);
  const [skmSuccessMsg, setSkmSuccessMsg] = useState('');

  const handleSkmSubmit = async (e) => {
    e.preventDefault();
    if (!skmNama.trim()) return;

    setSubmittingSkm(true);
    try {
      const payload = {
        nama: skmNama.trim(),
        instansi: skmInstansi.trim() || 'Masyarakat Umum',
        kemudahanAkses: Number(skmAkses),
        kejelasanInformasi: Number(skmInfo),
        kecepatanLayanan: Number(skmKecepatan),
        kualitasLayanan: Number(skmKualitas),
        saran: skmSaran.trim(),
        tanggal: new Date().toISOString().split('T')[0]
      };
      await submitSkm(payload);
      setSkmSuccessMsg('Terima kasih. Formulir Survei Kepuasan Masyarakat Anda telah berhasil dikirim.');
      setSkmNama('');
      setSkmInstansi('');
      setSkmSaran('');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setSkmSuccessMsg(''), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingSkm(false);
    }
  };

  const skmList = dbData?.skmResponses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Portal Pelayanan & Pengawasan</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Layanan Publik & Informasi Pengawasan
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Dokumen keterbukaan informasi berkala, sistem aplikasi pengawasan terpadu, survei kepuasan masyarakat, dan kanal pelaporan Whistleblowing System (WBS).
        </p>

        {/* Tab Navigasi Sub Menu */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('informasi-publik')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'informasi-publik'
                ? 'bg-[#063a69] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Informasi Publik</span>
          </button>

          <button
            onClick={() => setActiveTab('layanan-publik')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'layanan-publik'
                ? 'bg-[#063a69] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Layanan Publik</span>
          </button>

          <button
            onClick={() => setActiveTab('layanan-skm')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'layanan-skm'
                ? 'bg-[#063a69] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Survei Kepuasan Masyarakat</span>
          </button>

          <button
            onClick={() => setActiveTab('layanan-wbs')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'layanan-wbs'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Whistleblowing System (WBS)</span>
          </button>
        </div>
      </div>

      {/* 1. INFORMASI PUBLIK (IHP, RENSTRA, RENJA, RKP) */}
      {activeTab === 'informasi-publik' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-[#063a69]">
              Dokumen Keterbukaan Informasi Berkala
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Sesuai amanat Undang-Undang Keterbukaan Informasi Publik (KIP), dokumen kinerja pengawasan dapat diunduh secara resmi oleh publik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoPublik.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center justify-center px-3.5 py-1.5 min-w-[56px] w-auto h-auto rounded-lg bg-[#063a69] text-[#fbae17] font-heading font-extrabold text-xs uppercase tracking-wider shadow-xs">
                      {item.kode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {item.periode}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-[#063a69]">
                    {item.judul || item.nama}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Ukuran: {item.fileSize || 'PDF'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = item.fileUrl || item.url || '';
                        setPreviewDoc({
                          ...item,
                          title: item.judul || item.nama,
                          subtitle: item.kode || 'Informasi Publik',
                          fileUrl: url,
                          fileSize: item.fileSize,
                          periode: item.periode,
                          downloadName: `${item.kode || 'Dokumen'}-${item.judul || item.nama || item.id}`
                        });
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-[#f4f2ee] text-[#063a69] border border-[#063a69] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                      title="Buka dan baca dokumen langsung tanpa mengunduh"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d48f05]" />
                      <span>Buka Dokumen</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const url = item.fileUrl || item.url || '';
                        if (!isDocumentAvailable(url)) {
                          setPreviewDoc({
                            ...item,
                            title: item.judul || item.nama,
                            subtitle: item.kode || 'Informasi Publik',
                            fileUrl: url,
                            fileSize: item.fileSize,
                            periode: item.periode
                          });
                          return;
                        }
                        await downloadDocument(url, `${item.kode || 'Dokumen'}-${item.judul || item.nama || item.id}`);
                      }}
                      className="px-3.5 py-2 bg-[#063a69] hover:bg-[#042646] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                      title="Unduh file dokumen ke perangkat"
                    >
                      <Download className="w-3.5 h-3.5 text-[#fbae17]" />
                      <span>Unduh Dokumen</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LAYANAN PUBLIK (SIOLA, SP4N, PPID, SIPD, SIWASIAT, PPUPD, E-REVIU, SI CUKUP) */}
      {activeTab === 'layanan-publik' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-heading font-bold text-lg text-[#063a69]">
              Portal Aplikasi & Ekosistem Digital APIP
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Menghubungkan masyarakat, pemerintah daerah, dan pengawas intern ke dalam sistem informasi kementerian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {layananPublik.map((lay) => (
              <a
                key={lay.id}
                href={lay.url}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-[#fbae17] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 min-w-[50px] w-auto h-auto rounded-lg bg-gradient-to-br from-[#063a69] to-[#042646] text-[#fbae17] font-bold text-xs font-heading shadow-xs">
                      {lay.kode || lay.nama}
                    </span>
                    <span className="text-[10px] font-semibold text-[#063a69] bg-slate-100 px-2 py-0.5 rounded">
                      {lay.badge || lay.kategori}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-[#063a69] group-hover:text-[#042646]">
                    {lay.nama}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {lay.deskripsi}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#063a69] group-hover:text-[#d48f05]">
                  <span>Buka Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 3. SURVEI KEPUASAN MASYARAKAT (SKM) */}
      {activeTab === 'layanan-skm' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form SKM */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-[#d48f05] uppercase tracking-wider">
                  KemenPAN-RB Framework
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-[#063a69] mt-1">
                  Kuesioner Survei Kepuasan Masyarakat
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Berdasarkan Peraturan Menteri PAN-RB Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik.
                </p>
              </div>

              {skmSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                  <span>{skmSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSkmSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Responden *
                    </label>
                    <input
                      type="text"
                      value={skmNama}
                      onChange={(e) => setSkmNama(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Asal Instansi / Daerah
                    </label>
                    <input
                      type="text"
                      value={skmInstansi}
                      onChange={(e) => setSkmInstansi(e.target.value)}
                      placeholder="Contoh: Pemkab Bogor / ASN / Umum"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                    />
                  </div>
                </div>

                {/* 4 Dimensi SKM */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>1. Kemudahan Akses Layanan & Website</span>
                      <span className="text-[#063a69] font-bold">Skor: {skmAkses} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skmAkses}
                      onChange={(e) => setSkmAkses(Number(e.target.value))}
                      className="w-full accent-[#063a69]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>2. Kejelasan & Akurasi Informasi Pengawasan</span>
                      <span className="text-[#063a69] font-bold">Skor: {skmInfo} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skmInfo}
                      onChange={(e) => setSkmInfo(Number(e.target.value))}
                      className="w-full accent-[#063a69]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>3. Kecepatan Respons Layanan Publik</span>
                      <span className="text-[#063a69] font-bold">Skor: {skmKecepatan} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skmKecepatan}
                      onChange={(e) => setSkmKecepatan(Number(e.target.value))}
                      className="w-full accent-[#063a69]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>4. Kualitas & Nilai Tambah Pengawasan</span>
                      <span className="text-[#063a69] font-bold">Skor: {skmKualitas} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skmKualitas}
                      onChange={(e) => setSkmKualitas(Number(e.target.value))}
                      className="w-full accent-[#063a69]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kritik & Saran Perbaikan Pelayanan
                  </label>
                  <textarea
                    rows={3}
                    value={skmSaran}
                    onChange={(e) => setSkmSaran(e.target.value)}
                    placeholder="Saran Anda untuk peningkatan pelayanan Inspektorat Jenderal..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#063a69] bg-slate-50"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingSkm}
                    className="px-6 py-2.5 bg-[#063a69] hover:bg-[#042646] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center space-x-2 disabled:opacity-70"
                  >
                    <Send className="w-3.5 h-3.5 text-[#fbae17]" />
                    <span>{submittingSkm ? 'Mengirim...' : 'Kirim Survei SKM'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Rekapitulasi Skor SKM */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-[#063a69] to-[#042646] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
                <span className="bg-[#fbae17] text-[#063a69] text-[10px] font-heading font-bold uppercase px-2.5 py-0.5 rounded">
                  Indeks Kepuasan Masyarakat
                </span>
                <div className="text-center py-4">
                  <div className="font-heading font-black text-5xl text-[#fbae17]">
                    94.8%
                  </div>
                  <div className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                    Kategori: SANGAT BAIK (A)
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-200">
                  <div className="flex justify-between">
                    <span>Kemudahan Akses:</span>
                    <span className="font-bold text-[#fbae17]">96.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kejelasan Informasi:</span>
                    <span className="font-bold text-[#fbae17]">95.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kecepatan Layanan:</span>
                    <span className="font-bold text-[#fbae17]">93.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kualitas Pengawasan:</span>
                    <span className="font-bold text-[#fbae17]">94.6%</span>
                  </div>
                </div>
              </div>

              {/* Responden Terakhir */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#063a69]">
                  Respon Masukan Terkini:
                </h4>
                <div className="space-y-3">
                  {skmList.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <strong>{item.nama} ({item.instansi})</strong>
                        <span>{item.tanggal}</span>
                      </div>
                      {item.saran && <p className="text-slate-700 italic">"{item.saran}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WHISTLEBLOWING SYSTEM (WBS) */}
      {activeTab === 'layanan-wbs' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Card Hero WBS */}
          <div className="bg-gradient-to-r from-red-950 via-red-900 to-[#063a69] text-white p-8 sm:p-12 rounded-2xl shadow-xl space-y-6">
            <div className="max-w-3xl space-y-3">
              <span className="bg-[#fbae17] text-[#063a69] text-xs font-heading font-bold uppercase px-3 py-1 rounded">
                Kanal Integritas & Anti Korupsi
              </span>
              <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                Whistleblowing System (WBS) Kemendagri
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
                {wbsInfo.deskripsi || 'Whistleblowing System (WBS) adalah sarana pelaporan bagi pegawai maupun masyarakat yang mengetahui adanya dugaan tindak pidana korupsi, penyalahgunaan wewenang, gratifikasi, atau pelanggaran disiplin di lingkungan Kementerian Dalam Negeri dan Pemerintah Daerah.'}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={wbsInfo.url || 'https://otda.kemendagri.go.id/layananwbs'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-[#fbae17] hover:bg-[#fec34d] text-[#063a69] font-heading font-bold text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <span>Akses Portal Laporan WBS Sekarang</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3 Prinsip Perlindungan Kerahasiaan */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="font-heading font-bold text-xl text-[#063a69] flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-700" />
              <span>Jaminan Perlindungan dan Kerahasiaan Pelapor</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h5 className="font-heading font-bold text-sm text-[#063a69]">Kerahasiaan Identitas</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identitas pelapor dijamin dirahasiakan sepenuhnya secara sistemik dan tidak akan dipublikasikan kepada pihak terlapor.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h5 className="font-heading font-bold text-sm text-[#063a69]">Perlindungan Hukum & Karir</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pelapor berhak mendapatkan perlindungan dari segala bentuk intimidasi, ancaman fisik, maupun diskriminasi kedinasan.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h5 className="font-heading font-bold text-sm text-[#063a69]">Prinsip Bukti 4W + 1H</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Laporan harus memuat indikasi jelas: What (apa), Who (siapa), Where (di mana), When (kapan), dan How (bagaimana modus terjadinya) disertai bukti permulaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Dokumen */}
      <DocumentPreviewModal
        docItem={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
