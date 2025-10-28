import axios from "axios";

// ============================
// BACKEND RENDER (Auth & Quejas)
// ============================
const renderClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL_RENDER, // Render
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

renderClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event("unauthorized"));
        }
        return Promise.reject(error);
    }
);

// ============================
// BACKEND KOYEB (Captcha)
// ============================
const koyebClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL_KOYEB, // Koyeb
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

// ============================
// ENDPOINTS AUTH (Render)
// ============================
export const authApi = {
    login: (credentials) => renderClient.post('/api/auth/login', credentials),
    register: (userData) => renderClient.post('/api/auth/register', userData),
    logout: () => renderClient.post('/api/auth/logout'),
    getCurrentUser: () => renderClient.get('/api/auth/me'),
    refreshSession: () => renderClient.post('/api/auth/refresh'),
};

// ============================
// ENDPOINTS QUEJAS (Render)
// ============================
export const complaintsAPI = {
    getComplaints: (page, size, entity) => {
        const params = { page, size };
        if (entity) params.entity = entity;
        return renderClient.get('/api/complaints', { params });
    },
    createComplaint: (complaintData) => renderClient.post('/api/complaints', complaintData),
    deleteComplaint: (id, password) => renderClient.delete(`/api/complaints/delete/${id}`, { data: { password } }),
    createAnswer: (complaintId, message) => renderClient.post(`/api/answers/add`, { complaintId, message }),
    getAllComplaints: () => renderClient.get('/api/complaints'),
    getComplaintsByEntity: (entity) => renderClient.get(`/api/complaints/${entity}`),
};

// ============================
// ENDPOINT CAPTCHA (Koyeb)
// ============================
export const captchaAPI = {
    verifyCaptcha: (token) => koyebClient.post('/api/verify-captcha', { token }),
};

// ============================
// EXPORT
// ============================
export default { renderClient, koyebClient };
