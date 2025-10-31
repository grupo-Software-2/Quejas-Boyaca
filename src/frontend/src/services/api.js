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

complaintsClient.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers['Authorization'] = `Bearer ${sessionId}`;
  }
  return config;
});

complaintsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

// ============================
// ENDPOINTS AUTH
// ============================
export const authApi = {
  login: (credentials) => authClient.post('/api/auth/login', credentials),
  register: (userData) => authClient.post('/api/auth/register', userData),
  logout: () => authClient.post('/api/auth/logout'),
  getCurrentUser: () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      return Promise.reject(new Error("No hay sesión disponible"));
    }
    return authClient.get('/api/auth/me');
  },
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
  createAnswer: (complaintId, message) => complaintsClient.post(`/api/answers/add`, { complaint_id: complaintId, message }),
};

// ============================
// ENDPOINTS PROTEGIDOS (Render)
// ============================
export const protectedComplaintsAPI = {
  deleteComplaint: async (id, password) => {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      throw new Error("No hay sesión disponible. Por favor, inicie sesión.");
    }

    return complaintsClient.delete(`/api/complaints/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      data: { password },
    });
  },

  editComplaint: async (id, updatedData) => {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      throw new Error("No hay sesión disponible. Por favor, inicie sesión.");
    }

    return complaintsClient.put(`/api/complaints/edit/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });
  },
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
