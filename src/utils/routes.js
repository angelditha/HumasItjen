export const SITE_ORIGIN = 'https://humasitjen.vercel.app';
export const DEFAULT_TITLE = 'Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia';
export const DEFAULT_DESCRIPTION =
  'Portal resmi Humas Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia (Itjen Kemendagri). Informasi tugas fungsi, profil pejabat, berita pengawasan, regulasi, layanan publik, dan direktori Inspektorat Daerah 38 Provinsi.';

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getNewsSlug(newsItem) {
  if (!newsItem) return '';
  if (newsItem.slug) return newsItem.slug;
  return slugify(newsItem.judul) || String(newsItem.id || '');
}

export function findNewsBySlug(newsList = [], slug = '') {
  if (!slug || !Array.isArray(newsList)) return null;
  const normalized = slug.toLowerCase();
  return (
    newsList.find((item) => getNewsSlug(item).toLowerCase() === normalized) ||
    newsList.find((item) => String(item.id).toLowerCase() === normalized) ||
    null
  );
}

export const STATIC_ROUTES = [
  {
    path: '/',
    page: 'beranda',
    subPage: null,
    title: 'Beranda | Inspektorat Jenderal Kemendagri',
    description: DEFAULT_DESCRIPTION
  },
  {
    path: '/visi-misi',
    page: 'profil',
    subPage: 'visi-misi',
    title: 'Visi & Misi | Inspektorat Jenderal Kemendagri',
    description:
      'Visi, misi, dan sasaran strategis pengawasan Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia.'
  },
  {
    path: '/logo-lambang',
    page: 'profil',
    subPage: 'logo-lambang',
    title: 'Logo & Lambang Angga Raksa Dharma | Itjen Kemendagri',
    description:
      'Makna filosofis logo dan lambang Angga Raksa Dharma Inspektorat Jenderal Kementerian Dalam Negeri.'
  },
  {
    path: '/core-value',
    aliases: ['/core-values'],
    page: 'profil',
    subPage: 'core-values',
    title: 'Core Value BerAKHLAK & Berdampak | Itjen Kemendagri',
    description:
      'Nilai dasar ASN BerAKHLAK dan pengawasan berdampak di lingkungan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/struktur-organisasi',
    page: 'profil',
    subPage: 'struktur-organisasi',
    title: 'Struktur Organisasi | Inspektorat Jenderal Kemendagri',
    description:
      'Struktur organisasi Sekretariat dan Inspektorat Wilayah I sampai IV serta Inspektorat Khusus di Itjen Kemendagri.'
  },
  {
    path: '/tugas-fungsi',
    aliases: ['/profil'],
    page: 'profil',
    subPage: 'tugas-fungsi',
    title: 'Tugas & Fungsi | Inspektorat Jenderal Kemendagri',
    description:
      'Tugas pokok dan fungsi Inspektorat Jenderal Kementerian Dalam Negeri dalam menyelenggarakan pengawasan intern dan pembinaan pemerintahan daerah.'
  },
  {
    path: '/profil-pejabat',
    page: 'profil',
    subPage: 'profil-pejabat',
    title: 'Profil Pejabat | Inspektorat Jenderal Kemendagri',
    description:
      'Profil pimpinan dan jajaran pejabat struktural Inspektorat Jenderal Kementerian Dalam Negeri Republik Indonesia.'
  },
  {
    path: '/berita',
    page: 'berita',
    subPage: null,
    title: 'Berita & Informasi Pengawasan | Itjen Kemendagri',
    description:
      'Arsip berita pengawasan Itjen Kemendagri, berita Kementerian Dalam Negeri, dan berita nasional terkini.'
  },
  {
    path: '/berita-nasional',
    page: 'berita',
    subPage: 'berita-nasional',
    title: 'Berita Nasional | Inspektorat Jenderal Kemendagri',
    description:
      'Kumpulan berita nasional terkait tata kelola pemerintahan dan pengawasan pembangunan daerah.'
  },
  {
    path: '/berita-kemendagri',
    page: 'berita',
    subPage: 'berita-kemendagri',
    title: 'Berita Kemendagri | Inspektorat Jenderal Kemendagri',
    description:
      'Publikasi berita resmi kegiatan Kementerian Dalam Negeri Republik Indonesia.'
  },
  {
    path: '/berita-pengawasan',
    page: 'berita',
    subPage: 'berita-pengawasan',
    title: 'Berita Pengawasan Itjen | Inspektorat Jenderal Kemendagri',
    description:
      'Rilis berita resmi kegiatan pembinaan dan pengawasan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/media-foto',
    aliases: ['/media'],
    page: 'media',
    subPage: 'media-foto',
    title: 'Galeri Foto Dokumentasi | Itjen Kemendagri',
    description:
      'Galeri foto dokumentasi resmi kegiatan pembinaan dan pengawasan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/media-video',
    page: 'media',
    subPage: 'media-video',
    title: 'Galeri Video Liputan | Itjen Kemendagri',
    description:
      'Koleksi video liputan dan edukasi pengawasan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/media-infografis',
    page: 'media',
    subPage: 'media-infografis',
    title: 'Infografis Pengawasan | Itjen Kemendagri',
    description:
      'Infografis edukasi pengawasan, akuntabilitas APBD, dan pencegahan korupsi daerah.'
  },
  {
    path: '/inspektorat-daerah',
    page: 'inspektorat-daerah',
    subPage: null,
    title: 'Inspektorat Daerah 38 Provinsi | Itjen Kemendagri',
    description:
      'Direktori tautan portal resmi Inspektorat Daerah di 38 Provinsi seluruh Indonesia.'
  },
  {
    path: '/regulasi',
    page: 'regulasi',
    subPage: null,
    title: 'Regulasi & Produk Hukum | Itjen Kemendagri',
    description:
      'Dokumen resmi Permendagri, Kepmendagri, dan Surat Edaran bidang pengawasan penyelenggaraan pemerintahan daerah.'
  },
  {
    path: '/permendagri',
    page: 'regulasi',
    subPage: 'reg-permendagri',
    title: 'Permendagri | Regulasi Itjen Kemendagri',
    description:
      'Daftar Peraturan Menteri Dalam Negeri (Permendagri) terkait pembinaan dan pengawasan penyelenggaraan pemerintahan daerah.'
  },
  {
    path: '/kepmendagri',
    page: 'regulasi',
    subPage: 'reg-kepmendagri',
    title: 'Kepmendagri | Regulasi Itjen Kemendagri',
    description:
      'Daftar Keputusan Menteri Dalam Negeri (Kepmendagri) bidang pengawasan dan tata kelola pemerintahan.'
  },
  {
    path: '/surat-edaran',
    page: 'regulasi',
    subPage: 'reg-se',
    title: 'Surat Edaran (SE) | Regulasi Itjen Kemendagri',
    description:
      'Surat Edaran Menteri Dalam Negeri dan Inspektur Jenderal terkait pengawasan daerah.'
  },
  {
    path: '/informasi-publik',
    aliases: ['/layanan'],
    page: 'layanan',
    subPage: 'informasi-publik',
    title: 'Informasi Publik | Layanan Itjen Kemendagri',
    description:
      'Dokumen keterbukaan informasi publik berkala seperti IHP, Renstra, Renja, dan RKP Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/layanan-publik',
    page: 'layanan',
    subPage: 'layanan-publik',
    title: 'Layanan Publik | Itjen Kemendagri',
    description:
      'Portal sistem aplikasi dan layanan publik terpadu Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/survei-kepuasan-masyarakat',
    page: 'layanan',
    subPage: 'layanan-skm',
    title: 'Survei Kepuasan Masyarakat | Itjen Kemendagri',
    description:
      'Partisipasi Survei Kepuasan Masyarakat (SKM) atas kualitas pelayanan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/wbs',
    page: 'layanan',
    subPage: 'layanan-wbs',
    title: 'Whistleblowing System (WBS) | Itjen Kemendagri',
    description:
      'Kanal pelaporan pengaduan pelanggaran dan tindak pidana korupsi melalui Whistleblowing System Itjen Kemendagri.'
  }
];

export const ADMIN_ROUTES = [
  {
    path: '/dashboard-admin',
    aliases: ['/admin'],
    tab: 'ringkasan',
    subTab: null,
    expandedMenu: null,
    title: 'Dashboard Admin | Humas Itjen Kemendagri',
    description: 'Panel kontrol utama pengelola konten portal Humas Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/kelola-profil-institusi',
    aliases: ['/kelola-profil-institusi/visi-misi', '/kelola-profil', '/kelola-profil-instusi'],
    tab: 'profil',
    subTab: 'visi-misi',
    expandedMenu: 'profil',
    title: 'Kelola Profil Institusi - Visi & Misi | Admin Itjen Kemendagri',
    description: 'Kelola data Visi dan Misi Inspektorat Jenderal Kementerian Dalam Negeri.'
  },
  {
    path: '/kelola-profil-institusi/logo-lambang',
    aliases: ['/kelola-profil-institusi/logo-filosofi'],
    tab: 'profil',
    subTab: 'logo-lambang',
    expandedMenu: 'profil',
    title: 'Kelola Profil Institusi - Logo & Filosofi | Admin Itjen Kemendagri',
    description: 'Kelola filosofi logo Kemendagri dan lambang Angga Raksa Dharma Itjen Kemendagri.'
  },
  {
    path: '/kelola-profil-institusi/core-value',
    aliases: ['/kelola-profil-institusi/core-values'],
    tab: 'profil',
    subTab: 'core-values',
    expandedMenu: 'profil',
    title: 'Kelola Profil Institusi - Core Value BerAKHLAK | Admin Itjen Kemendagri',
    description: 'Kelola Core Value ASN BerAKHLAK dan Berdampak Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/kelola-profil-institusi/struktur-organisasi',
    tab: 'profil',
    subTab: 'struktur-organisasi',
    expandedMenu: 'profil',
    title: 'Kelola Profil Institusi - Struktur Organisasi | Admin Itjen Kemendagri',
    description: 'Kelola bagan dan data unit eselon pada Struktur Organisasi Itjen Kemendagri.'
  },
  {
    path: '/kelola-profil-institusi/tugas-fungsi',
    tab: 'profil',
    subTab: 'tugas-fungsi',
    expandedMenu: 'profil',
    title: 'Kelola Profil Institusi - Tugas & Fungsi | Admin Itjen Kemendagri',
    description: 'Kelola uraian Tugas Pokok dan Fungsi Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/kelola-profil-institusi/profil-pejabat',
    aliases: ['/kelola-profil-pejabat'],
    tab: 'pejabat',
    subTab: null,
    expandedMenu: 'profil',
    title: 'Kelola Profil Pejabat | Admin Itjen Kemendagri',
    description: 'Kelola daftar profil pimpinan dan pejabat struktural Itjen Kemendagri.'
  },
  {
    path: '/kelola-berita',
    tab: 'berita',
    subTab: 'all',
    expandedMenu: 'berita',
    title: 'Kelola Berita - Semua Berita | Admin Itjen Kemendagri',
    description: 'Kelola seluruh rilis berita nasional, Kemendagri, dan berita pengawasan.'
  },
  {
    path: '/kelola-berita/nasional',
    tab: 'berita',
    subTab: 'nasional',
    expandedMenu: 'berita',
    title: 'Kelola Berita Nasional | Admin Itjen Kemendagri',
    description: 'Kelola publikasi Berita Nasional pada portal Humas Itjen Kemendagri.'
  },
  {
    path: '/kelola-berita/kemendagri',
    tab: 'berita',
    subTab: 'kemendagri',
    expandedMenu: 'berita',
    title: 'Kelola Berita Kemendagri | Admin Itjen Kemendagri',
    description: 'Kelola publikasi Berita Kemendagri pada portal Humas Itjen Kemendagri.'
  },
  {
    path: '/kelola-berita/pengawasan',
    tab: 'berita',
    subTab: 'pengawasan',
    expandedMenu: 'berita',
    title: 'Kelola Berita Pengawasan | Admin Itjen Kemendagri',
    description: 'Kelola rilis Berita Pengawasan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/kelola-media',
    tab: 'media',
    subTab: 'all',
    expandedMenu: 'media',
    title: 'Kelola Media (CRUDS) - Semua Media | Admin Itjen Kemendagri',
    description: 'Kelola seluruh galeri foto, video liputan, dan infografis Itjen Kemendagri.'
  },
  {
    path: '/kelola-media/foto',
    tab: 'media',
    subTab: 'photos',
    expandedMenu: 'media',
    title: 'Kelola Media - Galeri Foto | Admin Itjen Kemendagri',
    description: 'Kelola foto dokumentasi resmi kegiatan pengawasan Itjen Kemendagri.'
  },
  {
    path: '/kelola-media/video',
    tab: 'media',
    subTab: 'videos',
    expandedMenu: 'media',
    title: 'Kelola Media - Video Liputan | Admin Itjen Kemendagri',
    description: 'Kelola koleksi video liputan dan publikasi pengawasan Itjen Kemendagri.'
  },
  {
    path: '/kelola-media/infografis',
    tab: 'media',
    subTab: 'infographics',
    expandedMenu: 'media',
    title: 'Kelola Media - Infografis | Admin Itjen Kemendagri',
    description: 'Kelola infografis edukasi pengawasan Inspektorat Jenderal Kemendagri.'
  },
  {
    path: '/kelola-inspektorat-daerah',
    aliases: ['/kelola-inspektorat-38-provinsi'],
    tab: 'daerah',
    subTab: null,
    expandedMenu: null,
    title: 'Kelola Inspektorat 38 Provinsi | Admin Itjen Kemendagri',
    description: 'Kelola direktori nama dan tautan portal Inspektorat Daerah 38 Provinsi.'
  },
  {
    path: '/kelola-regulasi',
    tab: 'regulasi',
    subTab: 'all',
    expandedMenu: 'regulasi',
    title: 'Kelola Regulasi - Semua Regulasi | Admin Itjen Kemendagri',
    description: 'Kelola daftar dokumen Permendagri, Kepmendagri, dan Surat Edaran.'
  },
  {
    path: '/kelola-regulasi/permendagri',
    tab: 'regulasi',
    subTab: 'Permendagri',
    expandedMenu: 'regulasi',
    title: 'Kelola Regulasi - Permendagri | Admin Itjen Kemendagri',
    description: 'Kelola dokumen Peraturan Menteri Dalam Negeri (Permendagri).'
  },
  {
    path: '/kelola-regulasi/kepmendagri',
    tab: 'regulasi',
    subTab: 'Kepmendagri',
    expandedMenu: 'regulasi',
    title: 'Kelola Regulasi - Kepmendagri | Admin Itjen Kemendagri',
    description: 'Kelola dokumen Keputusan Menteri Dalam Negeri (Kepmendagri).'
  },
  {
    path: '/kelola-regulasi/surat-edaran',
    tab: 'regulasi',
    subTab: 'SE',
    expandedMenu: 'regulasi',
    title: 'Kelola Regulasi - Surat Edaran (SE) | Admin Itjen Kemendagri',
    description: 'Kelola dokumen Surat Edaran (SE) pengawasan Itjen Kemendagri.'
  },
  {
    path: '/kelola-informasi-publik',
    aliases: ['/kelola-layanan/informasi-publik', '/kelola-layanan'],
    tab: 'layanan',
    subTab: 'informasiPublik',
    expandedMenu: 'layanan',
    title: 'Kelola Layanan - Informasi Publik | Admin Itjen Kemendagri',
    description: 'Kelola dokumen keterbukaan Informasi Publik Itjen Kemendagri.'
  },
  {
    path: '/kelola-layanan-publik',
    aliases: ['/kelola-layanan/layanan-publik'],
    tab: 'layanan',
    subTab: 'layananPublik',
    expandedMenu: 'layanan',
    title: 'Kelola Layanan - Layanan Publik | Admin Itjen Kemendagri',
    description: 'Kelola daftar portal aplikasi dan Layanan Publik Itjen Kemendagri.'
  },
  {
    path: '/kelola-penilaian-skm',
    aliases: ['/kelola-layanan/skm-penilaian'],
    tab: 'penilaian',
    subTab: null,
    expandedMenu: 'layanan',
    title: 'Kelola SKM & Penilaian Publik | Admin Itjen Kemendagri',
    description: 'Kelola hasil Survei Kepuasan Masyarakat dan ulasan penilaian website.'
  }
];

function normalizePathname(pathname = '/') {
  let decoded = pathname || '/';
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep raw pathname if percent-encoding is malformed
  }
  const clean = decoded.split('?')[0].split('#')[0].trim().replace(/\s+/g, '-');
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1).toLowerCase();
  }
  return clean.toLowerCase() || '/';
}

export function parseAdminPathToState(pathname = '/') {
  const clean = normalizePathname(pathname);
  const matched = ADMIN_ROUTES.find(
    (route) =>
      route.path === clean ||
      (Array.isArray(route.aliases) && route.aliases.includes(clean))
  );
  if (!matched) return null;
  return {
    tab: matched.tab,
    subTab: matched.subTab || null,
    expandedMenu: matched.expandedMenu || null
  };
}

export function getPathForAdminState(tab = 'ringkasan', subTab = null) {
  const exact = ADMIN_ROUTES.find(
    (r) => r.tab === tab && (r.subTab || null) === (subTab || null)
  );
  if (exact) return exact.path;
  const fallback = ADMIN_ROUTES.find((r) => r.tab === tab);
  return fallback ? fallback.path : '/dashboard-admin';
}

export function getAdminSeoMetaForState(tab = 'ringkasan', subTab = null) {
  const matched =
    ADMIN_ROUTES.find(
      (r) => r.tab === tab && (r.subTab || null) === (subTab || null)
    ) ||
    ADMIN_ROUTES.find((r) => r.tab === tab) ||
    ADMIN_ROUTES[0];

  return {
    title: matched.title,
    description: matched.description,
    canonicalPath: matched.path
  };
}

export function parsePathToState(pathname = '/') {
  const clean = normalizePathname(pathname);

  if (clean === '/profil') {
    return { page: 'profil', subPage: 'visi-misi', newsSlug: null };
  }

  if (clean.startsWith('/berita/')) {
    const newsSlug = decodeURIComponent(clean.slice('/berita/'.length)).trim();
    if (newsSlug) {
      return { page: 'berita', subPage: null, newsSlug };
    }
  }

  const matched = STATIC_ROUTES.find(
    (route) =>
      route.path === clean ||
      (Array.isArray(route.aliases) && route.aliases.includes(clean))
  );

  if (matched) {
    return { page: matched.page, subPage: matched.subPage, newsSlug: null };
  }

  return { page: 'beranda', subPage: null, newsSlug: null };
}

export function getPathForState(page, subPage = null, selectedNews = null) {
  if (selectedNews && page === 'berita') {
    return `/berita/${getNewsSlug(selectedNews)}`;
  }

  const normalizedSub = normalizeSubPage(page, subPage);

  if (page === 'beranda') return '/';
  if (page === 'inspektorat-daerah') return '/inspektorat-daerah';

  const exact = STATIC_ROUTES.find(
    (r) => r.page === page && (r.subPage || null) === normalizedSub
  );
  if (exact) return exact.path;

  if (page === 'profil') return '/visi-misi';
  if (page === 'berita') return '/berita';
  if (page === 'media') return '/media-foto';
  if (page === 'regulasi') return '/regulasi';
  if (page === 'layanan') return '/informasi-publik';

  return '/';
}

export function normalizeSubPage(page, subPage) {
  if (page === 'layanan' && subPage === 'layanan-informasi-publik') {
    return 'informasi-publik';
  }
  return subPage || null;
}

export function getSeoMetaForState(page, subPage = null, selectedNews = null) {
  const normalizedSub = normalizeSubPage(page, subPage);

  if (selectedNews && page === 'berita') {
    const slugPath = `/berita/${getNewsSlug(selectedNews)}`;
    return {
      title: `${selectedNews.judul} | Itjen Kemendagri`,
      description:
        selectedNews.ringkasan ||
        String(selectedNews.konten || DEFAULT_DESCRIPTION).slice(0, 160),
      canonicalPath: slugPath
    };
  }

  const matched =
    STATIC_ROUTES.find(
      (r) => r.page === page && (r.subPage || null) === normalizedSub
    ) || STATIC_ROUTES.find((r) => r.page === page && !r.subPage);

  if (matched) {
    return {
      title: matched.title,
      description: matched.description,
      canonicalPath: matched.path
    };
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonicalPath: '/'
  };
}

function upsertMetaTag(selector, attrName, attrValue, content) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function applyMetaDocument({ title, description, canonicalPath, ogType = 'website' }) {
  if (typeof document === 'undefined') return;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`;

  document.title = title;
  upsertMetaTag('meta[name="description"]', 'name', 'description', description);
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
}

export function applySeoMeta(page, subPage = null, selectedNews = null) {
  const meta = getSeoMetaForState(page, subPage, selectedNews);
  applyMetaDocument({
    ...meta,
    ogType: selectedNews ? 'article' : 'website'
  });
}

export function applyAdminSeoMeta(tab = 'ringkasan', subTab = null) {
  const meta = getAdminSeoMetaForState(tab, subTab);
  applyMetaDocument({
    ...meta,
    ogType: 'website'
  });
}
