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

function normalizePathname(pathname = '/') {
  const clean = (pathname || '/').split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1).toLowerCase();
  }
  return clean.toLowerCase() || '/';
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

export function applySeoMeta(page, subPage = null, selectedNews = null) {
  if (typeof document === 'undefined') return;
  const { title, description, canonicalPath } = getSeoMetaForState(
    page,
    subPage,
    selectedNews
  );
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`;

  document.title = title;
  upsertMetaTag('meta[name="description"]', 'name', 'description', description);
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMetaTag('meta[property="og:type"]', 'property', 'og:type', selectedNews ? 'article' : 'website');

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
}
