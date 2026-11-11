import React, { useState } from 'react';
import { 
  Target, 
  Shield, 
  Award, 
  Users, 
  FileCheck, 
  UserCheck, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export default function Profile({ dbData, activeSubPage, setActiveSubPage }) {
  const profileData = dbData?.profile || {};
  const officersList = dbData?.officers || [];

  // Active sub tab state
  const currentTab = activeSubPage || 'visi-misi';

  const tabs = [
    { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
    { id: 'logo-lambang', label: 'Logo & Lambang', icon: Shield },
    { id: 'core-values', label: 'Core Value BerAKHLAK', icon: Award },
    { id: 'struktur-organisasi', label: 'Struktur Organisasi', icon: Layers },
    { id: 'tugas-fungsi', label: 'Tugas & Fungsi', icon: FileCheck },
    { id: 'profil-pejabat', label: 'Profil Pejabat', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Header Halaman */}
      <div className="border-b border-slate-300 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[#d48f05] flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#fbae17] inline-block rounded-xs"></span>
          <span>Tentang Institusi</span>
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-[#063a69] mt-1">
          Profil Inspektorat Jenderal Kemendagri
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Mengenal lebih dekat visi, misi, landasan filosofis, struktur organisasi, dan profil para pemimpin pengawasan di lingkungan Kementerian Dalam Negeri.
        </p>

        {/* Tab Navigasi Sub Menu */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubPage(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#063a69] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fbae17]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. VISI & MISI */}
      {currentTab === 'visi-misi' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Card Visi */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border-l-8 border-[#063a69] border-y border-r border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#063a69] text-[#fbae17] flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#063a69]">
                Visi Inspektorat Jenderal
              </h3>
            </div>
            <blockquote className="text-base sm:text-lg font-medium text-slate-800 italic leading-relaxed bg-[#f4f2ee] p-6 rounded-xl border border-slate-200">
              "{profileData.visi || 'Menjadi Aparat Pengawasan Intern Pemerintah (APIP) yang Profesional, Berintegritas, dan Berdaya Saing dalam Mengawal Penyelenggaraan Pemerintahan Dalam Negeri yang Bersih, Efektif, dan Akuntabel.'}"
            </blockquote>
          </div>

          {/* Card Misi */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#fbae17] text-[#063a69] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#063a69]">
                Misi Pengawasan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profileData.misi || [
                "Mewujudkan pengawasan intern yang independen, objektif, dan bernilai tambah bagi peningkatan tata kelola pemerintahan daerah.",
                "Mendorong pencegahan dan pemberantasan tindak pidana korupsi serta penguatan integritas aparatur sipil negara di lingkungan Kementerian Dalam Negeri dan Pemerintah Daerah.",
                "Meningkatkan kualitas akuntabilitas keuangan dan kinerja seluruh satuan kerja Kementerian Dalam Negeri dan Pemerintah Daerah.",
                "Mengembangkan kapasitas, kapabilitas, dan profesionalisme auditor serta Pengawas Penyelenggaraan Urusan Pemerintahan Daerah (PPUPD) berbasis teknologi informasi.",
                "Membangun kolaborasi pengawasan yang harmonis dengan seluruh pemangku kepentingan pusat dan daerah demi percepatan pelayanan publik."
              ]).map((misiText, idx) => (
                <div 
                  key={idx}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3.5 hover:border-[#fbae17] transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-[#063a69] text-[#fbae17] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {misiText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. LOGO & LAMBANG */}
      {currentTab === 'logo-lambang' && (
        <section className="space-y-10 animate-fadeIn">
          {/* A. LAMBANG KEMENDAGRI */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <img 
                  src="/assets/logo-kemendagri.png" 
                  alt="Lambang Kementerian Dalam Negeri" 
                  className="h-56 sm:h-64 w-auto object-contain drop-shadow-md"
                />
                <span className="mt-4 text-xs font-bold text-[#063a69] uppercase tracking-wider text-center">
                  Kementerian Dalam Negeri Republik Indonesia
                </span>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#d48f05] uppercase tracking-wider">
                    Lambang Kementerian
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Makna Lambang Kementerian Dalam Negeri
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                  {profileData.lambangMakna?.kemendagri?.deskripsi || 'Lambang Kementerian Dalam Negeri berbentuk perisai bersudut lima berlatar biru tua, memuat Burung Garuda Pancasila di dalam lingkaran rantai emas, diapit tangkai padi dan kapas, serta bintang emas bersudut lima di bagian atas.'}
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-[#063a69] uppercase tracking-wider">
                    Arti dan Filosofi Unsur Lambang:
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {(profileData.lambangMakna?.kemendagri?.filosofi || [
                      "Bintang Emas: Ketuhanan Yang Maha Esa sebagai landasan moral dan spiritual segenap aparatur negara.",
                      "Garuda Pancasila: Falsafah dan dasar negara Republik Indonesia dalam wadah persatuan Bhinneka Tunggal Ika.",
                      "Padi dan Kapas: Kemakmuran, kecukupan sandang pangan, dan keadilan sosial bagi seluruh rakyat Indonesia.",
                      "Rantai Emas: Solidaritas, keterikatan yang kokoh antarwilayah dan seluruh jajaran pemerintahan dari pusat hingga daerah.",
                      "Perisai Segi Lima: Kesiapsiagaan mengawal kedaulatan, ketertiban, dan keutuhan Negara Kesatuan Republik Indonesia."
                    ]).map((filo, i) => (
                      <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-[#fbae17] flex-shrink-0 mt-0.5" />
                        <span>{filo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* B. LAMBANG ANGGA RAKSA DHARMA */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <img 
                  src="/assets/logo-anggaraksa.png" 
                  alt="Lambang Angga Raksa Dharma Inspektorat Jenderal" 
                  className="h-56 sm:h-64 w-auto object-contain drop-shadow-md"
                />
                <span className="mt-4 text-xs font-bold text-[#d48f05] uppercase tracking-wider text-center">
                  Inspektorat Jenderal - Anggaraksa Dharma
                </span>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#d48f05] uppercase tracking-wider">
                    Semboyan & Lambang Pengawasan
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-[#063a69]">
                    Makna Lambang "Angga Raksa Dharma"
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                  {profileData.lambangMakna?.anggaraksaDharma?.deskripsi || "Semboyan dan lambang kebanggaan Inspektorat Jenderal Kementerian Dalam Negeri adalah 'Angga Raksa Dharma'. Memiliki makna luhur sebagai Pengawal dan Penjaga yang Menegakkan Ketertiban, Aturan, dan Kebajikan."}
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-[#063a69] uppercase tracking-wider">
                    Filosofi Rinci Lambang Anggaraksa Dharma:
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {(profileData.lambangMakna?.anggaraksaDharma?.filosofi || [
                      "Angga: Berarti raga atau segenap elemen organisasi yang bersatu dalam dedikasi pengawasan.",
                      "Raksa: Menjaga, melindungi, dan membentengi institusi dari penyimpangan serta potensi korupsi.",
                      "Dharma: Kewajiban mulia, kebenaran hukum, aturan, serta integritas tertinggi sebagai abdi negara.",
                      "Kemudi Kapal & Kompas Emas: Simbol arah pemandu jalannya organisasi agar senantiasa berada pada jalur kepatuhan, kehati-hatian, dan efisiensi.",
                      "Burung Garuda Emas: Ketajaman penglihatan pengawasan, wibawa, dan keberanian menegakkan kebenaran tanpa kompromi.",
                      "Tali Tambang Emas Melingkar: Ikatan disiplin, keteguhan profesionalisme, dan persaudaraan sesama jajaran APIP."
                    ]).map((filo, i) => (
                      <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-[#063a69] flex-shrink-0 mt-0.5" />
                        <span>{filo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CORE VALUE BERAKHLAK & BERDAMPAK */}
      {currentTab === 'core-values' && (
        <section className="space-y-8 animate-fadeIn">
          {/* Pengawasan Berdampak */}
          <div className="bg-gradient-to-r from-[#063a69] to-[#042646] text-white p-8 sm:p-10 rounded-2xl shadow-md space-y-4">
            <span className="bg-[#fbae17] text-[#063a69] text-xs font-heading font-bold uppercase px-3 py-1 rounded">
              Arah Transformasi APIP
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Pengawasan Berdampak (Impactful Auditing)
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-4xl leading-relaxed text-justify">
              {profileData.coreValues?.berdampak?.deskripsi || 'Pengawasan Itjen Kemendagri tidak hanya sekadar mencari kesalahan administrasi (watchdog), melainkan bertransformasi menjadi mitra strategis (trusted advisor) dan katalisator perubahan (catalyst) yang memberikan rekomendasi nyata, terukur, dan berdampak langsung pada kesejahteraan rakyat di daerah.'}
            </p>
          </div>

          {/* 7 Nilai Dasar BerAKHLAK */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h4 className="font-heading font-bold text-xl text-[#063a69]">
                7 Nilai Dasar ASN: BerAKHLAK
              </h4>
              <p className="text-xs text-slate-500">
                Panduan perilaku dan etos kerja seluruh auditor dan aparatur Itjen Kemendagri
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(profileData.coreValues?.berakhlak || [
                { kode: "Ber", nama: "Berorientasi Pelayanan", desc: "Komitmen memberikan pelayanan prima demi kepuasan masyarakat dan entitas yang diawasi." },
                { kode: "A", nama: "Akuntabel", desc: "Bertanggung jawab atas kepercayaan yang diberikan dengan jujur, disiplin, dan berintegritas tinggi." },
                { kode: "K", nama: "Kompeten", desc: "Terus belajar dan mengembangkan kapabilitas audit, reviu, evaluasi, dan pemantauan terkini." },
                { kode: "H", nama: "Harmonis", desc: "Saling peduli dan menghargai perbedaan untuk mewujudkan iklim kerja yang kondusif." },
                { kode: "L", nama: "Loyal", desc: "Berdedikasi dan mengutamakan kepentingan bangsa serta negara di atas kepentingan pribadi/golongan." },
                { kode: "A", nama: "Adaptif", desc: "Terus berinovasi dan antusias dalam menggerakkan ataupun menghadapi perubahan teknologi pengawasan digital." },
                { kode: "K", nama: "Kolaboratif", desc: "Membangun kerja sama yang sinergis bersama KPK, BPKP, Kejaksaan, Kepolisian, dan Inspektorat Daerah." }
              ]).map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-[#063a69] text-[#fbae17] font-bold text-xs flex items-center justify-center font-heading">
                      {val.kode}
                    </span>
                    <h5 className="font-heading font-bold text-sm text-[#063a69]">
                      {val.nama}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. STRUKTUR ORGANISASI */}
      {currentTab === 'struktur-organisasi' && (
        <section className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs font-bold text-[#d48f05] uppercase tracking-wider">
              Bagan Hubungan Kerja
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-[#063a69] mt-1">
              Bagan Struktur Organisasi Inspektorat Jenderal
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {profileData.strukturOrganisasi?.deskripsi || 'Berdasarkan Peraturan Menteri Dalam Negeri tentang Organisasi dan Tata Kerja Kementerian Dalam Negeri.'}
            </p>
          </div>

          {/* Foto Bagan Struktur Organisasi Hasil Unggahan */}
          {profileData.strukturOrganisasi?.foto && (
            <div className="space-y-4">
              <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <img
                  src={profileData.strukturOrganisasi.foto}
                  alt="Bagan Struktur Organisasi Inspektorat Jenderal Kemendagri"
                  className="w-full max-h-[850px] object-contain rounded-xl shadow-sm mx-auto bg-white p-2"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-1">
                <span>Bagan susunan resmi organisasi Inspektorat Jenderal Kementerian Dalam Negeri.</span>
                <a
                  href={profileData.strukturOrganisasi.foto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#063a69] hover:underline"
                >
                  Buka Gambar Ukuran Penuh
                </a>
              </div>
            </div>
          )}

          {/* Diagram Bagan Hierarki */}
          {!profileData.strukturOrganisasi?.foto && (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
            {/* Top: Menteri */}
            <div className="flex justify-center">
              <div className="bg-[#042646] text-white px-6 py-3 rounded-lg text-center shadow-md">
                <div className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Pimpinan Kementerian</div>
                <div className="font-heading font-bold text-sm">Menteri Dalam Negeri Republik Indonesia</div>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-300 mx-auto"></div>

            {/* Level 1: Inspektur Jenderal */}
            <div className="flex justify-center">
              <div className="bg-[#063a69] text-white px-8 py-4 rounded-xl text-center shadow-lg border-2 border-[#fbae17] max-w-md w-full">
                <div className="text-[11px] text-[#fbae17] uppercase tracking-wider font-bold">Pimpinan Tinggi Madya (Eselon I.a)</div>
                <div className="font-heading font-extrabold text-base sm:text-lg">INSPEKTUR JENDERAL</div>
                <div className="text-xs text-slate-200 mt-0.5">Komjen Pol (Purn) Drs. Tomsi Tohir, M.Si.</div>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-300 mx-auto"></div>

            {/* Level 2: Sekretaris Itjen */}
            <div className="flex justify-center">
              <div className="bg-white border-2 border-[#063a69] text-slate-800 px-6 py-3 rounded-xl text-center shadow-sm max-w-sm w-full">
                <div className="text-[10px] text-[#063a69] uppercase tracking-wider font-bold">Pimpinan Tinggi Pratama</div>
                <div className="font-heading font-bold text-sm text-[#063a69]">SEKRETARIAT INSPEKTORAT JENDERAL</div>
                <div className="text-xs text-slate-600">Dr. Endang Tri Setyasih, M.M.</div>
                <div className="text-[10px] text-slate-500 mt-1 border-t border-slate-100 pt-1">
                  Membawahi Bagian Perencanaan, Keuangan, Kepegawaian, TU & Humas
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-300 my-4"></div>

            {/* Level 3: Inspektorat Wilayah I - IV & Khusus */}
            <div>
              <div className="text-center text-xs font-bold text-[#063a69] uppercase tracking-wider mb-4">
                Inspektorat Wilayah Pembinaan & Pengawasan Daerah:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded">Wilayah I</span>
                  <div className="font-heading font-bold text-xs text-[#063a69] mt-2">Inspektorat Wilayah I</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">Brigjen Pol Rustam Mansur, S.I.K.</div>
                  <div className="text-[10px] text-slate-500 mt-1">Cakupan: Seluruh Provinsi Sumatera</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded">Wilayah II</span>
                  <div className="font-heading font-bold text-xs text-[#063a69] mt-2">Inspektorat Wilayah II</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">Dr. Ucok Abdulrauf Damenta</div>
                  <div className="text-[10px] text-slate-500 mt-1">Cakupan: Jawa, Bali, NTB, NTT</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded">Wilayah III</span>
                  <div className="font-heading font-bold text-xs text-[#063a69] mt-2">Inspektorat Wilayah III</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">Elfin Elyas, S.Sos, M.Si.</div>
                  <div className="text-[10px] text-slate-500 mt-1">Cakupan: Kalimantan & Sulawesi</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-[#d48f05] bg-amber-50 px-2 py-0.5 rounded">Wilayah IV</span>
                  <div className="font-heading font-bold text-xs text-[#063a69] mt-2">Inspektorat Wilayah IV</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">Ihsan Dirgahayu, S.STP, M.AP.</div>
                  <div className="text-[10px] text-slate-500 mt-1">Cakupan: Maluku & Tanah Papua</div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">Investigasi</span>
                  <div className="font-heading font-bold text-xs text-red-900 mt-2">Inspektorat Khusus</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">Teguh Narutomo, S.STP, M.Si.</div>
                  <div className="text-[10px] text-slate-500 mt-1">Audit Investigatif & Pengaduan WBS</div>
                </div>
              </div>
            </div>

            {/* Level 4: Jabatan Fungsional */}
            <div className="pt-2 text-center text-xs text-slate-500">
              Didukung oleh Kelompok Jabatan Fungsional Auditor (Ahli Utama, Madya, Muda, Pertama) dan Pejabat Fungsional PPUPD.
            </div>
          </div>
          )}
        </section>
      )}

      {/* 5. TUGAS & FUNGSI */}
      {currentTab === 'tugas-fungsi' && (
        <section className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-8 animate-fadeIn">
          {/* Tugas Pokok */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#d48f05] text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>Tugas Pokok Berdasarkan Peraturan Perundang-Undangan</span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#063a69]">
              Tugas Inspektorat Jenderal
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200 text-justify">
              {profileData.tugasFungsi?.tugas || 'Inspektorat Jenderal mempunyai tugas menyelenggarakan pengawasan intern di lingkungan Kementerian Dalam Negeri dan pengawasan terhadap penyelenggaraan urusan pemerintahan daerah sesuai dengan ketentuan peraturan perundang-undangan.'}
            </p>
          </div>

          {/* Fungsi-Fungsi Utama */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xl text-[#063a69]">
              Fungsi-Fungsi Pengawasan
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {(profileData.tugasFungsi?.fungsi || [
                "Penyusunan kebijakan teknis pengawasan intern di lingkungan Kementerian Dalam Negeri dan pengawasan penyelenggaraan urusan pemerintahan daerah;",
                "Pelaksanaan pengawasan intern di lingkungan Kementerian Dalam Negeri terhadap kinerja dan keuangan melalui audit, reviu, evaluasi, pemantauan, dan kegiatan pengawasan lainnya;",
                "Pelaksanaan pengawasan terhadap penyelenggaraan urusan pemerintahan daerah meliputi pengawasan umum dan pengawasan teknis;",
                "Pelaksanaan pengawasan untuk tujuan tertentu atas penugasan Menteri Dalam Negeri;",
                "Penyusunan laporan hasil pengawasan di lingkungan Kementerian Dalam Negeri dan penyelenggaraan urusan pemerintahan daerah;",
                "Pelaksanaan administrasi Inspektorat Jenderal; dan",
                "Pelaksanaan fungsi lain yang diberikan oleh Menteri Dalam Negeri."
              ]).map((fungsiItem, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3.5 hover:border-[#063a69] transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-[#063a69] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {fungsiItem}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. PROFIL PEJABAT */}
      {currentTab === 'profil-pejabat' && (
        <section className="space-y-6 animate-fadeIn">
          {/* Header Persis Seperti Referensi Foto Pengguna */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#063a69] tracking-wider uppercase">
              PEJABAT UTAMA
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Susunan pimpinan Inspektorat Jenderal
            </h3>
          </div>

          {/* Grid Kartu Pejabat: Hanya Foto, Nama, Jabatan Sesuai Contoh Foto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {officersList.map((officer) => (
              <div
                key={officer.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all p-4 flex flex-col group"
              >
                {/* Foto Card Top Container dengan Background Biru Gelap Halus */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#132d4b] to-[#1c4472] aspect-[4/4.5] flex items-end justify-center shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18)_0,transparent_75%)] pointer-events-none"></div>
                  <img
                    src={officer.foto || '/assets/officer-arief.png'}
                    alt={officer.nama}
                    className="w-full h-full object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Data Pejabat: Cukup Foto, Nama, dan Jabatan */}
                <div className="pt-4 pb-2 px-1">
                  <h4 className="font-heading font-bold text-lg text-slate-900 leading-snug group-hover:text-[#063a69] transition-colors">
                    {officer.nama}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    {officer.jabatan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
