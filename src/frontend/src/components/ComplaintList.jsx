import { useState, useEffect, useCallback } from "react";
import DeleteComplaintModal from "./DeleteComplaintModal";
import AnswerSection from "./AnswerSection";
import { complaintsAPI, protectedComplaintsAPI } from "../services/api";

// Función para estilo de estado de la queja
const getStatusStyle = (status) => {
  switch (status) {
    case "Pendiente":
      return { color: "#FFA500", fontWeight: "bold" };
    case "Resuelta":
      return { color: "#28a745", fontWeight: "bold" };
    case "Rechazada":
      return { color: "#dc3545", fontWeight: "bold" };
    default:
      return {};
  }
};

// Mock de ejemplo en caso de fallo de carga
const mockComplaints = [
  { id: 1, text: "Queja de prueba 1", date: new Date(), status: "Pendiente", answers: [] },
  { id: 2, text: "Queja de prueba 2", date: new Date(), status: "Resuelta", answers: [] },
];

function ComplaintListByEntity({ entities, normalizeEntityName }) {
  // === ESTADO DEL COMPONENTE ===
  const [selectedEntity, setSelectedEntity] = useState("");
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // ESTADO DE PAGINACIÓN
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // ESTADO DE INTERFAZ
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para cargar quejas reales o usar mock
  const loadComplaints = useCallback(() => {
    if (!selectedEntity) return;

    setLoading(true);
    complaintsAPI.getComplaintsByEntity(selectedEntity)
      .then((res) => {
        const data = res.data || [];
        setAllComplaints(data);

        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);

        const start = page * pageSize;
        const end = start + pageSize;
        setComplaints(data.slice(start, end));
      })
      .catch((err) => {
        console.error("Error al cargar quejas:", err);
        // Si hay error o no hay quejas, usamos mock
        setAllComplaints(mockComplaints);
        setTotalPages(Math.ceil(mockComplaints.length / pageSize));
        setComplaints(mockComplaints.slice(0, pageSize));
      })
      .finally(() => setLoading(false));
  }, [selectedEntity, page]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useEffect(() => {
    setPage(0);
  }, [selectedEntity]);

  // PAGINACIÓN
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const handlePageChange = (newPage) => setPage(newPage);

  // Funciones para eliminar queja
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
    setIsDeleting(true);
    try {
      await protectedComplaintsAPI.deleteComplaint(complaintToDelete.id, password);
      alert("Queja eliminada exitosamente.");
      setShowDeleteModal(false);
      setComplaintToDelete(null);
      loadComplaints();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al eliminar la queja.";
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para editar queja
  const handleEditClick = async (updatedComplaint) => {
    try {
      await protectedComplaintsAPI.editComplaint(updatedComplaint.id, updatedComplaint);
      alert("Queja editada correctamente.");
      loadComplaints();
    } catch (error) {
      alert(error.response?.data?.error || "Error al editar la queja.");
    }
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
          <option key={i} value={ent}>
            {normalizeEntityName(ent)}
          </option>
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
            <li
              key={c.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#ffffffff",
                color: "#000",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <div>
                    <strong>Queja ID {c.id}:</strong>
                    {c.status && <span style={{ marginLeft: '10px', ...getStatusStyle(c.status) }}>{c.status}</span>}
                  </div>
                  <p style={{ margin: '5px 0' }}>{c.text}</p>
                  <small>{new Date(c.date).toLocaleString()}</small>
                </div>

                {/* BOTONES EDITAR Y ELIMINAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                  <button
                    onClick={() => handleEditClick(c)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ffff4bff",
                      color: "black",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteClick(c)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ee5766ff",
                      color: "black",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
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

      {/* PAGINACIÓN */}
      {!loading && complaints.length > 0 && totalPages > 1 && (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <button onClick={handlePreviousPage} disabled={page === 0} style={{ marginRight: '10px' }}>
            &laquo; Anterior
          </button>

          {[...Array(totalPages).keys()].map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              disabled={page === num}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                border: page === num ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: page === num ? '#007bff' : 'white',
                color: page === num ? 'white' : '#000',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {num + 1}
            </button>
          ))}

          <button onClick={handleNextPage} disabled={page === totalPages - 1} style={{ marginLeft: '10px' }}>
            Siguiente &raquo;
          </button>
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
    </div>
  );
}

export default ComplaintListByEntity;
