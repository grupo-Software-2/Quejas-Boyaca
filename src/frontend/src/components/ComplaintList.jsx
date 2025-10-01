import { useState, useEffect } from "react";
import { complaintsAPI } from "../services/api";
import DeleteComplaintModal from "./DeleteComplaintModal";
import AnswerSection from "./AnswerSection"; 

function ComplaintListByEntity({ entities, normalizeEntityName }) {
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [complaints, setComplaints] = useState([]); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadComplaints = () => {
    complaintsAPI.getComplaintsByEntity(selectedEntity)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedEntity]);

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

  return (
    <div>
      <label>Seleccione una entidad:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        {entities.map((ent, i) => (
          <option key={i} value={ent}>
            {normalizeEntityName(ent)}
          </option>
        ))}
      </select>

      <h2>📑 Quejas registradas para: {normalizeEntityName(selectedEntity)}</h2>
      {complaints.length === 0 ? (
        <p>No hay quejas registradas para esta entidad.</p>
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
                backgroundColor: "#f9f9f9",
                color: "#000",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <strong>Queja ID {c.id}:</strong> {c.text} <br />
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

              {/* INTEGRACIÓN DE LA SECCIÓN DE RESPUESTAS */}
              <AnswerSection
                complaintId={c.id}
                initialAnswers={c.answers}
                onAnswerAdded={loadComplaints} // Recargar la lista para mostrar la nueva respuesta
              />
            </li>
          ))}
        </ul>
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
