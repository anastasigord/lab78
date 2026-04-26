const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function buildUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function parseResponse(response) {
  if (response.ok) {
    if (response.status === 204) {
      return null
    }
    return response.json()
  }

  let detail = 'Request failed'
  try {
    const errorData = await response.json()
    detail = errorData.detail || detail
  } catch {
    detail = response.statusText || detail
  }

  throw new Error(detail)
}

export function getImageUrl(photoUrl) {
  if (!photoUrl) return null
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl
  return `${API_BASE_URL}${photoUrl}`
}

export async function fetchInventoryList() {
  const response = await fetch(buildUrl('/inventory'))
  return parseResponse(response)
}

export async function fetchInventoryItem(id) {
  const response = await fetch(buildUrl(`/inventory/${id}`))
  return parseResponse(response)
}

export async function createInventoryItem({ inventory_name, description, photo }) {
  const formData = new FormData()
  formData.append('inventory_name', inventory_name)
  formData.append('description', description || '')
  if (photo) {
    formData.append('photo', photo)
  }

  const response = await fetch(buildUrl('/register'), {
    method: 'POST',
    body: formData,
  })

  return parseResponse(response)
}

export async function updateInventoryText(id, { inventory_name, description }) {
  const response = await fetch(buildUrl(`/inventory/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inventory_name, description }),
  })

  return parseResponse(response)
}

export async function updateInventoryPhoto(id, photo) {
  const formData = new FormData()
  formData.append('photo', photo)

  const response = await fetch(buildUrl(`/inventory/${id}/photo`), {
    method: 'PUT',
    body: formData,
  })

  return parseResponse(response)
}

export async function deleteInventoryItem(id) {
  const response = await fetch(buildUrl(`/inventory/${id}`), {
    method: 'DELETE',
  })

  return parseResponse(response)
}
