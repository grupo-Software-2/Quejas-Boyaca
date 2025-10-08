import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const complaintsAPI = {
    getComplaints: (page, size, entity) => {
        const params = { page, size };
        if (entity) {
            params.entity = entity;
        }
        return apiClient.get('/api/complaints', { params });
    },
    createComplaint: (complaintData) => apiClient.post('/api/complaints', complaintData),
    deleteComplaint: (id, password) => apiClient.delete(`/api/complaints/delete/${id}`, { data: { password } }),
    createAnswer: (complaintId, message) => apiClient.post(`/api/answers/add`, {
        complaintId,
        message
    }),

    //metodos sin paginacion
    getAllComplaints: () => apiClient.get('/api/complaints'),
    getComplaintsByEntity: (entity) => apiClient.get(`/api/complaints/${entity}`),

};

export default apiClient;