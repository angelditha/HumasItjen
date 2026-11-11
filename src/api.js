// API Client helper for Humas Itjen Kemendagri

const API_BASE = '/api';

export async function fetchAllData() {
  try {
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) throw new Error('Gagal mengambil data dari server');
    return await res.json();
  } catch (err) {
    console.warn('API fetchAllData gagal, menggunakan fallback lokal:', err);
    // Fallback: coba fetch data db.json langsung jika dev
    try {
      const resLocal = await fetch('/assets/db.json');
      if (resLocal.ok) return await resLocal.json();
    } catch (e) {
      // ignore
    }
    return null;
  }
}

export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    // Client-side fallback if server offline
    const isValid = 
      (username === 'humas@gmail.com' && password === 'itjenhumas123') ||
      (username === 'humasitjen' && password === 'humas2026') ||
      (username === 'humas@gmail.com' && password === 'humas2026') ||
      (username === 'humasitjen' && password === 'itjenhumas123');

    if (isValid) {
      return {
        success: true,
        token: 'local-token-' + Date.now(),
        user: { 
          username: username, 
          email: username.includes('@') ? username : 'humas@gmail.com',
          name: 'Administrator Humas Itjen', 
          role: 'admin' 
        }
      };
    }
    return { success: false, message: 'Koneksi ke server gagal atau kredensial salah.' };
  }
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('Ukuran file melebihi batas unggahan server (maksimal ~4 MB di cloud). Gunakan file lebih kecil atau tempel tautan URL dokumen.');
    }
    let msg = 'Gagal mengunggah file';
    try {
      const errBody = await res.json();
      if (errBody?.message) msg = errBody.message;
    } catch {
      // ignore non-JSON body
    }
    throw new Error(msg);
  }
  return await res.json();
}

// News CRUD
export async function createNews(newsData) {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newsData)
  });
  return await res.json();
}

export async function updateNews(id, newsData) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newsData)
  });
  return await res.json();
}

export async function deleteNews(id) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Officers CRUD
export async function createOfficer(officerData) {
  const res = await fetch(`${API_BASE}/officers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(officerData)
  });
  return await res.json();
}

export async function updateOfficer(id, officerData) {
  const res = await fetch(`${API_BASE}/officers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(officerData)
  });
  return await res.json();
}

export async function deleteOfficer(id) {
  const res = await fetch(`${API_BASE}/officers/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Media CRUD
export async function createMedia(type, mediaData) {
  const res = await fetch(`${API_BASE}/media/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mediaData)
  });
  return await res.json();
}

export async function updateMedia(type, id, mediaData) {
  const res = await fetch(`${API_BASE}/media/${type}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mediaData)
  });
  return await res.json();
}

export async function deleteMedia(type, id) {
  const res = await fetch(`${API_BASE}/media/${type}/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Inspectorates CRUD
export async function createInspectorate(data) {
  const res = await fetch(`${API_BASE}/inspectorates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateInspectorate(id, data) {
  const res = await fetch(`${API_BASE}/inspectorates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteInspectorate(id) {
  const res = await fetch(`${API_BASE}/inspectorates/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Regulations CRUD
export async function createRegulation(data) {
  const res = await fetch(`${API_BASE}/regulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateRegulation(id, data) {
  const res = await fetch(`${API_BASE}/regulations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteRegulation(id) {
  const res = await fetch(`${API_BASE}/regulations/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Services CRUD
export async function createService(section, data) {
  const res = await fetch(`${API_BASE}/services/${section}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateService(section, id, data) {
  const res = await fetch(`${API_BASE}/services/${section}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteService(section, id) {
  const res = await fetch(`${API_BASE}/services/${section}/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function updateWbsConfig(data) {
  const res = await fetch(`${API_BASE}/services/wbs/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// Ratings
export async function submitRating(data) {
  const res = await fetch(`${API_BASE}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteRating(id) {
  const res = await fetch(`${API_BASE}/ratings/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// SKM
export async function submitSkm(data) {
  const res = await fetch(`${API_BASE}/skm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteSkm(id) {
  const res = await fetch(`${API_BASE}/skm/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// Profile
export async function updateProfile(data) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
