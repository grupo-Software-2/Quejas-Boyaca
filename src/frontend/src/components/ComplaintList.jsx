import { useState, useEffect, useCallback } from "react";
import { complaintsAPI } from "../services/api";
import DeleteComplaintModal from "./DeleteComplaintModal";
import AnswerSection from "./AnswerSection";

function ComplaintListByEntity({ entities, normalizeEntityName }) {
  // === ESTADO DEL COMPONENTE ===
  const [selectedEntity, setSelectedEntity] = useState("");
  const [allComplaints, setAllComplaints] = useState([]); // Todas las quejas para la entidad seleccionada
  const [complaints, setComplaints] = useState([]);

  // ESTADO DE PAGINACIÓN
  const [page, setPage] = useState(0); // Página actual (0-indexed, como Spring)
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Máximo de quejas por página

  // ESTADO DE LA INTERFAZ
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función memorizada para cargar quejas con paginación y filtro
  const loadComplaints = useCallback(() => {
    if (!selectedEntity) return;

    setLoading(true);
    complaintsAPI.getComplaintsByEntity(selectedEntity)
      .then((res) => {
        const data = res.data || [];
        setAllComplaints(data);

        // Calcular paginación en el cliente
        const total = Math.ceil(data.length / pageSize);
        setTotalPages(total);

        // Obtener la página actual
        const start = page * pageSize;
        const end = start + pageSize;
        setComplaints(data.slice(start, end));
      })
      .catch((err) => {
        console.error("Error al cargar quejas:", err);
        setAllComplaints([]);
        setComplaints([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [selectedEntity, page]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  // Resetear la página a 0 cada vez que se cambie la entidad de filtrado
  useEffect(() => {
    setPage(0);
  }, [selectedEntity]);

  // HANDLERS DE PAGINACIÓN
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = async (password) => {
    if (!complaintToDelete) return;
    setIsDeleting(true);
    try {
      await complaintsAPI.deleteComplaint(complaintToDelete.id, password);
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

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setComplaintToDelete(null);
  };

  const getStatusStyle = (status) => {
    const styles = {
      PROCESO: { backgroundColor: '#ffc107', color: '#000' },
      REVISION: { backgroundColor: '#17a2b8', color: 'white' },
      CERRADA: { backgroundColor: '#28a745', color: 'white' },
    };
    return {
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      ...styles[status],
    };
  };

  return (
    <div>
      <label>Seleccione una entidad:</label>
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

      <h2>📑 Quejas registradas para: {normalizeEntityName(selectedEntity)}</h2>

      {loading && <p>Cargando quejas...</p>}

      {!loading && (!complaints || complaints.length === 0) ? (
        <p>No hay quejas registradas para esta entidad.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {complaints && complaints.map((c) => (
            <li
              key={c.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
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
                  <small>📅 {new Date(c.date).toLocaleString()}</small>
                </div>
                <button
                  onClick={() => handleDeleteClick(c)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Eliminar
                </button>
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

      {/* Controles de Paginación */}
      {!loading && complaints && complaints.length > 0 && totalPages > 1 && (
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