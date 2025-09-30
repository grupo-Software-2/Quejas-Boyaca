import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const complaintsAPI = {
    getAllComplaints: () => apiClient.get('/api/complaints'),
    getComplaintsByEntity: (entity) => apiClient.get(`/api/complaints/${entity}`),
    createComplaint: (complaintData) => apiClient.post('/api/complaints', complaintData),
    deleteComplaint: (id, password) => apiClient.delete(`/api/complaints/delete/${id}`, { data: { password } })
};

export default apiClient;