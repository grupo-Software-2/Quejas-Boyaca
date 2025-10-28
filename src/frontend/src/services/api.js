import axios from "axios";

// ============================
// BACKEND AUTH (Render)
// ============================
const authClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL_RENDER, // AUTH
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

authClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event("unauthorized"));
        }
        return Promise.reject(error);
    }
);

// ============================
// BACKEND APP (Quejas Koyeb)
// ============================
const complaintsClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL_KOYEB, // APP
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// ============================
// ENDPOINTS AUTH
// ============================
export const authApi = {
    login: (credentials) => authClient.post('/api/auth/login', credentials),
    register: (userData) => authClient.post('/api/auth/register', userData),
    logout: () => authClient.post('/api/auth/logout'),
    getCurrentUser: () => authClient.get('/api/auth/me'),
    refreshSession: () => authClient.post('/api/auth/refresh'),
};

// ============================
// ENDPOINTS PÚBLICOS (Koyeb)
// ============================
export const complaintsAPI = {
  getComplaints: (page, size, entity) => {
    const params = { page, size };
    if (entity) params.entity = entity;
    return complaintsClient.get('/api/complaints', { params });
  },
  createComplaint: (complaintData) => complaintsClient.post('/api/complaints', complaintData),
  getAllComplaints: () => complaintsClient.get('/api/complaints'),
  getComplaintsByEntity: (entity) => complaintsClient.get(`/api/complaints/${entity}`),
  createAnswer: (complaintId, message) =>
    complaintsClient.post(`/api/answers/add`, { complaintId, message }),
};

// ============================
// ENDPOINTS PROTEGIDOS (Render)
// ============================
export const protectedComplaintsAPI = {
  deleteComplaint: async (id, password) => {
    // 1️⃣ Validar usuario y contraseña en Auth (Render)
    await authClient.post(`/api/complaints/verify-password`, { id, password });
    
    // 2️⃣ Si pasa la validación, hacer DELETE en Koyeb (o Render puede hacerlo internamente)
    return complaintsClient.delete(`/api/complaints/delete/${id}`);
  },

  editComplaint: (id, updatedData) =>
    authClient.put(`/api/complaints/edit/${id}`, updatedData),
};

// ============================
// ENDPOINT CAPTCHA
// ============================
export const captchaAPI = {
    verifyCaptcha: (token) => complaintsClient.post('/api/verify-captcha', { token }),
};

// ============================
// EXPORT
// ============================
export default { authClient, complaintsClient };
