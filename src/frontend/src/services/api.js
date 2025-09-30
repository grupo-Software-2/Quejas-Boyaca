import axios from "axios";

const apiClient = axios.create({
    // === ARREGLO DE EMERGENCIA: FORZAMOS LA CONEXIÓN A LOCALHOST ===
    baseURL: 'http://localhost:8080', // <-- ESTA LÍNEA IGNORA LA VARIABLE DE ENTORNO PEGADA
    // baseURL: import.meta.env.VITE_API_URL, // <-- Línea original comentada
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const complaintsAPI = {
    getAllComplaints: () => apiClient.get('/api/complaints'),
    getComplaintsByEntity: (entity) => apiClient.get(`/api/complaints/${entity}`),
    createComplaint: (complaintData) => apiClient.post('/api/complaints', complaintData),
    deleteComplaint: (id, password) => apiClient.delete(`/api/complaints/delete/${id}`, { data: { password } }),
    
    // FUNCIÓN NUEVA
    createAnswer: (complaintId, message) => apiClient.post('/api/answers/add', { complaintId, message })
};

export default apiClient;