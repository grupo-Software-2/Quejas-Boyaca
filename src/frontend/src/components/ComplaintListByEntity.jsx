import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import DeleteComplaintModal from "./DeleteComplaintModal";
import EditComplaintModal from "./EditComplaintModal";
import AnswerSection from "./AnswerSection";
import { complaintsAPI, protectedComplaintsAPI } from "../services/api";


const getStatusStyle = (status) => {
  switch (status) {
    case "PENDIENTE":
    case "REVISION":
      return { color: "#FFA500", fontWeight: "bold" };
    case "PROCESO":
      return { color: "#17a2b8", fontWeight: "bold" };
    case "CERRADA":
      return { color: "#28a745", fontWeight: "bold" };
    case "RECHAZADA":
      return { color: "#dc3545", fontWeight: "bold" };
    default:
      return {};
  }
};

function ComplaintListByEntity({ entities, normalizeEntityName }) {
  const { sessionId, isAuthenticated } = useAuth();
  const [selectedEntity, setSelectedEntity] = useState("");
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [complaintToEdit, setComplaintToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const pageSize = 10;

  // Cargar quejas
  const loadComplaints = useCallback(() => {
    if (!selectedEntity) return;
    setLoading(true);
    complaintsAPI.getComplaintsByEntity(selectedEntity)
      .then((res) => {
        const data = res.data || [];
        // Normaliza las fechas si vienen en formato string para la visualización
        const normalizedData = data.map(c => ({
            ...c,
            // Asegura que la fecha tenga el formato correcto para new Date()
            date: c.date || c.createdAt || new Date().toISOString()
        }));
        setAllComplaints(normalizedData);
        const total = Math.ceil(normalizedData.length / pageSize);
        setTotalPages(total);
        setComplaints(normalizedData.slice(page * pageSize, (page + 1) * pageSize));
      })
      .catch((err) => {
        console.error("Error al cargar quejas:", err);
        setAllComplaints([]);
        setComplaints([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [selectedEntity, page]);

  useEffect(() => { loadComplaints(); }, [loadComplaints]);
  useEffect(() => { setPage(0); }, [selectedEntity]);

  // Paginación
  const handleNextPage = () => { if (page < totalPages - 1) setPage(page + 1); };
  const handlePreviousPage = () => { if (page > 0) setPage(page - 1); };
  const handlePageChange = (newPage) => setPage(newPage);

  // ===========================
  // FUNCIONES ELIMINAR / EDITAR
  // ===========================
  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setComplaintToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async (password) => {
    if (!complaintToDelete) return;
    if (!isAuthenticated || !sessionId) {
      console.error("Sesión no válida para eliminar.");
      return;
    }

    setIsDeleting(true);

    try {
      await protectedComplaintsAPI.deleteComplaint(complaintToDelete.id, password);
      console.log("Queja eliminada exitosamente.");
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      loadComplaints(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar la queja:", error.response?.data?.error || "Error al eliminar la queja.");
    } finally { setIsDeleting(false); }
  };

  const handleEditClick = (complaint) => {
    setComplaintToEdit(complaint);
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setComplaintToEdit(null);
    setShowEditModal(false);
  };

  // Función clave actualizada para la gestión de estado (CUMPLE LA TAREA)
  const handleConfirmEdit = async (updatedData) => {
    // updatedData contiene: { id, text, status, adminNote }
    if (!isAuthenticated || !sessionId) {
      console.error("Sesión no válida para editar.");
      return;
    }

    setIsEditing(true);

    try {
      // Se envía el nuevo estado y la nota para que el backend cree el evento histórico.
      await protectedComplaintsAPI.editComplaint(updatedData.id, updatedData);
      console.log("Queja gestionada/editada exitosamente.");
      setShowEditModal(false);
      setComplaintToEdit(null);
      loadComplaints(); // Recargar la lista para mostrar el nuevo estado
    } catch (error) {
      console.error("Error al editar/gestionar la queja:", error.response?.data?.error || "Error al editar la queja.");
    } finally { setIsEditing(false); }
  };

  return (
    <div style={{ padding: '10px 0' }}>
      <label style={{ color: "#000", fontWeight: 'bold', marginRight: '10px' }}>Seleccione una entidad:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        style={{ margin: "10px 0", padding: "8px", borderRadius: '5px', border: '1px solid #ccc' }}
      >
        <option value="" disabled>Seleccione una entidad</option>
        {entities.map((ent, i) => (
          <option key={i} value={ent}>{normalizeEntityName(ent)}</option>
        ))}
      </select>

      <h2 style={{ color: "#007bff", marginTop: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Quejas registradas para: {normalizeEntityName(selectedEntity)}
      </h2>

      {loading && <p style={{ color: '#000', textAlign: 'center' }}>Cargando quejas...</p>}

      {!loading && selectedEntity && (!complaints || complaints.length === 0) ? (
        <p style={{ color: "#000", textAlign: 'center', padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '5px' }}>
          No hay quejas registradas para esta entidad.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {complaints.map((c) => (
            <li key={c.id} style={{
              marginBottom: "15px", padding: "15px", border: "1px solid #ddd",
              borderRadius: "8px", backgroundColor: "#ffffffff", color: "#000",
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Queja ID {c.id}: {c.title || 'Sin título'}
                  </div>
                  <p style={{ margin: '5px 0' }}>{c.text}</p>
                  <small style={{ color: '#666' }}>
                    Registrada: {new Date(c.date).toLocaleString()}
                  </small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '20px', textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', ...getStatusStyle(c.status) }}>{c.status}</span>
                  <button onClick={() => handleEditClick(c)} style={{
                    padding: "5px 10px", backgroundColor: "#007bff",
                    color: "white", border: "none", borderRadius: "5px", cursor: "pointer",
                  }}>Gestión / Estado</button>

                  <button onClick={() => handleDeleteClick(c)} style={{
                    padding: "5px 10px", backgroundColor: "#dc3545",
                    color: "white", border: "none", borderRadius: "5px", cursor: "pointer",
                  }}>Eliminar</button>
                </div>
              </div>
                
                {/* Sección de Respuestas/Histórico */}
              <AnswerSection
                complaintId={c.id}
                initialAnswers={c.answers} // Asume que 'answers' viene en el objeto de queja
                onAnswerAdded={loadComplaints}
              />
            </li>
          ))}
        </ul>
      )}
      
      {/* Paginación */}
      {!loading && complaints.length > 0 && totalPages > 1 && (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <button onClick={handlePreviousPage} disabled={page === 0} style={{ marginRight: '10px', padding: '8px 15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: page === 0 ? '#eee' : '#fff', cursor: 'pointer' }}>&laquo; Anterior</button>
          {[...Array(totalPages).keys()].map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              disabled={page === num}
              style={{
                margin: '0 5px', padding: '8px 12px',
                border: page === num ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: page === num ? '#007bff' : 'white',
                color: page === num ? 'white' : '#000',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >{num + 1}</button>
          ))}
          <button onClick={handleNextPage} disabled={page === totalPages - 1} style={{ marginLeft: '10px', padding: '8px 15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: page === totalPages - 1 ? '#eee' : '#fff', cursor: 'pointer' }}>Siguiente &raquo;</button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>Página {page + 1} de {totalPages}</p>
        </div>
      )}

      {/* Modales */}
      {showDeleteModal && (
        <DeleteComplaintModal
          complaint={complaintToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}

      {showEditModal && (
        <EditComplaintModal
          complaint={complaintToEdit}
          normalizeEntityName={normalizeEntityName}
          onConfirm={handleConfirmEdit}
          onCancel={handleCancelEdit}
          isSubmitting={isEditing}
        />
      )}
    </div>
  );
}

export default ComplaintListByEntity;