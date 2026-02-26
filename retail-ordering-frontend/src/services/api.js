// POST /api/auth/register  { username, email, password, role, phone }  → "User registered"
// POST /api/auth/login     { username, password }                       → JWT string
// GET  /api/menu                                                        → List<Menu>
// POST /api/menu           { name, brand, category, price, stock }     → Menu  (ADMIN)
// POST /api/orders?menuId=&quantity=&deliveryAddress=                   → Order

import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

//Auth
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data, { responseType: 'text' }),
//   // data: { username, email, password, role, phone }
//   register: (data) => api.post('/auth/register', data, { responseType: 'text' }),
// }

export const authAPI = {
  login: (data) => api.post('/auth/login', data, { responseType: 'text' }),
  register: (data) => api.post('/auth/register', {
    ...data,
    contactNumber: data.phone ?? data.contactNumber, 
  }, { responseType: 'text' }),
}

//Menu / Products
export const menuAPI = {
  getAll: () => api.get('/menu'),
  add: (data) => api.post('/menu', data),
}

export const productsAPI = {
  getAll: () => menuAPI.getAll(),
  create: (data) => menuAPI.add(data),
  update: (_id, _data) => Promise.reject(new Error('Update not supported by this backend')),
  delete: (_id) => Promise.reject(new Error('Delete not supported by this backend')),
}

// ── Orders ────────────────────────────────────────────────────────────────
// // deliveryAddress is now required
// export const ordersAPI = {
//   place: (menuId, quantity, deliveryAddress) =>
//     api.post(`/orders?menuId=${menuId}&quantity=${quantity}&deliveryAddress=${encodeURIComponent(deliveryAddress)}`),
// }

export const ordersAPI = {
  place: (menuId, quantity, deliveryAddress) =>
    api.post('/orders', {        
      menuId,
      quantity,
      deliveryAddress
    }),
}
export default api
