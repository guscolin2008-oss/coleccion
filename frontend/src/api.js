import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

export const api = axios.create({ baseURL })

export async function listAll(resource, params = {}) {
  const results = []
  let url = `/${resource}/`
  let query = params
  while (url) {
    const { data } = await api.get(url, { params: query })
    if (Array.isArray(data)) {
      results.push(...data)
      break
    }
    results.push(...data.results)
    url = data.next
    query = undefined
    if (url) {
      const idx = url.indexOf('/api/')
      url = idx >= 0 ? url.slice(idx + 4) : url
    }
  }
  return results
}

export const createItem = (resource, payload) => api.post(`/${resource}/`, payload)
export const updateItem = (resource, id, payload) => api.patch(`/${resource}/${id}/`, payload)
export const deleteItem = (resource, id) => api.delete(`/${resource}/${id}/`)