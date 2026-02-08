const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3010'

async function backendRequest(path, { method = 'GET', body, user } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const headers = {}

  // Solo ponemos JSON header cuando NO es FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  // Identidad temporal multi-usuario (rápido)
  if (user?.name) headers['x-sap-user'] = user.name
  if (user?.companyDb) headers['x-company-db'] = user.companyDb

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? (isFormData ? body : JSON.stringify(body))
      : undefined,
    credentials: 'include',
  })

  // Manejar 204 No Content
  if (res.status === 204) return null

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text || null
  }

  if (!res.ok) {
    const msg =
      (data && data.error && data.error.message && data.error.message.value) ||
      (data && data.Message) ||
      (typeof data === 'string' ? data : null) ||
      `HTTP ${res.status}`
    throw new Error(msg)
  }

  return data
}

export async function getMyProfile(user) {
  return backendRequest('/api/me/profile', { user })
}

export async function upsertMyProfile(user, updates) {
  return backendRequest('/api/me/profile', {
    method: 'PUT',
    body: updates,
    user,
  })
}

// ✅ (lo usaremos en el siguiente paso) Upload real de avatar
export async function uploadMyAvatar(user, file) {
  const fd = new FormData()
  fd.append('avatar', file)

  return backendRequest('/api/me/avatar', {
    method: 'POST',
    body: fd,
    user,
  })
}

