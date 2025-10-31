import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import DeleteComplaintModal from "./DeleteComplaintModal";
import EditComplaintModal from "./EditComplaintModal";
import AnswerSection from "./AnswerSection";
import { complaintsAPI, protectedComplaintsAPI } from "../services/api";

// Estilo según el estado de la queja
const getStatusStyle = (status) => {
  switch (status) {
    case "Pendiente": return { color: "#FFA500", fontWeight: "bold" };
    case "Resuelta": return { color: "#28a745", fontWeight: "bold" };
    case "Rechazada": return { color: "#dc3545", fontWeight: "bold" };
    default: return {};
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
        setAllComplaints(data);
        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);
        setComplaints(data.slice(page * pageSize, (page + 1) * pageSize));
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
      alert("Sesión no válida. Por favor, inicie sesión nuevamente.");
      return;
    }

    setIsDeleting(true);

    try {
      await protectedComplaintsAPI.deleteComplaint(complaintToDelete.id, password);
      alert("Queja eliminada exitosamente.");
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      loadComplaints();
    } catch (error) {
      console.error("Error al eliminar la queja:", error);
      alert(error.response?.data?.error || "Error al eliminar la queja.");
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

  const handleConfirmEdit = async (updatedData) => {
    if (!isAuthenticated || !sessionId) {
      alert("Sesión no válida. Por favor, inicie sesión nuevamente.");
      return;
    }

    setIsEditing(true);

    try {
      await protectedComplaintsAPI.editComplaint(updatedData.id, updatedData);
      alert("Queja editada exitosamente.");
      setShowEditModal(false);
      setComplaintToEdit(null);
      loadComplaints();
    } catch (error) {
      console.error("Error al editar la queja:", error);
      alert(error.response?.data?.error || "Error al editar la queja.");
    } finally { setIsEditing(false); }
  };

  return (
    <div>
      <label style={{ color: "#000" }}>Seleccione una entidad:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        <option value="" disabled>Seleccione una entidad</option>
        {entities.map((ent, i) => (
          <option key={i} value={ent}>{normalizeEntityName(ent)}</option>
        ))}
      </select>

      <h2 style={{ color: "#000" }}>
        Quejas registradas para: {normalizeEntityName(selectedEntity)}
      </h2>

      {loading && <p>Cargando quejas...</p>}

      {!loading && (!complaints || complaints.length === 0) ? (
        <p style={{ color: "#000" }}>No hay quejas registradas para esta entidad.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {complaints.map((c) => (
            <li key={c.id} style={{
              marginBottom: "15px", padding: "15px", border: "1px solid #ddd",
              borderRadius: "8px", backgroundColor: "#ffffffff", color: "#000"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <div>
                    <strong>Queja ID {c.id}:</strong>
                    {c.status && <span style={{ marginLeft: '10px', ...getStatusStyle(c.status) }}>{c.status}</span>}
                  </div>
                  <p style={{ margin: '5px 0' }}>{c.text}</p>
                  <small>{new Date(c.date).toLocaleString()}</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                  <button onClick={() => handleEditClick(c)} style={{
                    padding: "5px 10px", backgroundColor: "#ffff4bff",
                    color: "black", border: "none", borderRadius: "5px", cursor: "pointer",
                  }}>Editar</button>

                  <button onClick={() => handleDeleteClick(c)} style={{
                    padding: "5px 10px", backgroundColor: "#ee5766ff",
                    color: "black", border: "none", borderRadius: "5px", cursor: "pointer",
                  }}>Eliminar</button>
                </div>
              </div>

              <AnswerSection
                complaintId={c.id}
                initialAnswers={c.answers}
                onAnswerAdded={loadComplaints}
              />
            </li>
          ))}
        </ul>
      )}

      {!loading && complaints.length > 0 && totalPages > 1 && (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <button onClick={handlePreviousPage} disabled={page === 0} style={{ marginRight: '10px' }}>&laquo; Anterior</button>
          {[...Array(totalPages).keys()].map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              disabled={page === num}
              style={{
                margin: '0 5px', padding: '5px 10px',
                border: page === num ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: page === num ? '#007bff' : 'white',
                color: page === num ? 'white' : '#000',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >{num + 1}</button>
          ))}
          <button onClick={handleNextPage} disabled={page === totalPages - 1} style={{ marginLeft: '10px' }}>Siguiente &raquo;</button>
          <p style={{ marginTop: '10px' }}>Página {page + 1} de {totalPages}</p>
        </div>
      )}

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
