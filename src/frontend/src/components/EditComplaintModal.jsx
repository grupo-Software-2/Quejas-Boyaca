import { useState, useEffect } from "react";

function EditComplaintModal({ complaint, normalizeEntityName, onConfirm, onCancel, isSubmitting }) {
    const [text, setText] = useState(complaint?.text || "");

    useEffect(() => {
        if (complaint) {
            setText(complaint.text);
        }
    }, [complaint]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim() || text.length > 1000) {
            alert("El texto de la queja no puede estar vacío y debe tener máximo 1000 caracteres.");
            return;
        }

        onConfirm({
            id: complaint.id,
            entity: complaint.entity,
            text: text.trim()
        });
    };

    if (!complaint) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    maxWidth: "600px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "#000",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ marginTop: 0, color: "#007bff" }}>✏️ Editar Queja</h2>

                <div
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                        borderLeft: "4px solid #007bff",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                        <strong>ID de la queja:</strong> {complaint.id}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                        <strong>Entidad:</strong> {normalizeEntityName(complaint.entity)}
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
                        <strong>Fecha:</strong> {new Date(complaint.date).toLocaleString()}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                            Descripción de la queja: <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isSubmitting}
                            maxLength={1000}
                            required
                            autoFocus
                            style={{
                                width: "100%",
                                height: "200px",
                                padding: "10px",
                                fontSize: "14px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                resize: "vertical",
                                boxSizing: "border-box",
                                fontFamily: "inherit"
                            }}
                        />
                        <small style={{ color: "#666", fontSize: "12px" }}>
                            {text.length} / 1000 caracteres
                        </small>
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.6 : 1,
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.6 : 1,
                            }}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditComplaintModal;