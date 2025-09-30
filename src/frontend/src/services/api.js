import axios from "axios";

const apiClient = axios.create({
    // 1. CORRECCIÓN: Usa la variable de entorno para ser compatible con Railway/Vercel
    baseURL: import.meta.env.VITE_API_URL, 
    // baseURL: 'http://localhost:8080', // Línea de emergencia ELIMINADA
    
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const complaintsAPI = {
    /**
     * 2. IMPLEMENTACIÓN DE PAGINACIÓN Y FILTRADO (Método unificado)
     * Reemplaza getAllComplaints y getComplaintsByEntity.
     */
    getComplaints: (page = 0, size = 10, entity = null) => {
        const params = { page, size };
        if (entity) {
            params.entity = entity; // Parámetro del filtro de entidad
        }
        // Llama al endpoint unificado: /api/complaints?page=X&size=Y&entity=Z
        return apiClient.get('/api/complaints', { params });
    },
    
    // El resto de funciones, con sintaxis corregida
    createComplaint: (complaintData) => apiClient.post('/api/complaints', complaintData),
    
    // 3. CORRECCIÓN DE SINTAXIS: Usar template literals correctamente
    deleteComplaint: (id, password) => apiClient.delete(`/api/complaints/delete/${id}`, { data: { password } }),
    
    // FUNCIÓN NUEVA
    createAnswer: (complaintId, message) => apiClient.post('/api/answers/add', { complaintId, message })
};

export default apiClient;