

import { useState, useEffect } from "react";


const availableStatuses = ["PENDIENTE", "REVISION", "PROCESO", "CERRADA", "RECHAZADA"]; 

function EditComplaintModal({ complaint, normalizeEntityName, onConfirm, onCancel, isSubmitting }) {
   
    const [text, setText] = useState(complaint?.text || "");
    const [status, setStatus] = useState(complaint?.status || "PENDIENTE");
    const [adminNote, setAdminNote] = useState("");
    const [error, setError] = useState(null);


    useEffect(() => {
        if (complaint) {
            setText(complaint.text || "");
            setStatus(complaint.status || "PENDIENTE");
            setAdminNote(""); 
            setError(null);
        }
    }, [complaint]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim() || text.length > 1000) {
            setError("El texto de la queja no puede estar vacío y debe tener máximo 1000 caracteres.");
            return;
        }
        
      
        onConfirm({
            id: complaint.id,
            entity: complaint.entity,
            text: text.trim(),
            status: status, 
            adminNote: adminNote.trim() 
        });
    };

    if (!complaint) return null;

    
    const modalStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const contentStyle = {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        color: "#000",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxSizing: "border-box",
        fontSize: "14px"
    };
    
    const buttonBaseStyle = {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        opacity: isSubmitting ? 0.6 : 1,
        transition: 'background-color 0.2s'
    };

    return (
        <div style={modalStyle} onClick={onCancel}>
            <div
                style={contentStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ marginTop: 0, color: "#007bff", borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    ⚙️ Gestión de Queja ID {complaint.id}
                </h2>

                <div
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                        borderLeft: "4px solid #007bff",
                    }}
                >
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                        <strong>Entidad:</strong> {normalizeEntityName(complaint.entity)}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                        <strong>Estado Actual:</strong> <span style={{fontWeight: 'bold', color: complaint.status === 'CERRADA' ? '#dc3545' : '#17a2b8'}}>{complaint.status}</span>
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
                        <strong>Fecha Registro:</strong> {new Date(complaint.date).toLocaleString()}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* 1. CAMBIO DE ESTADO (Prioritario) */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                            Nuevo Estado: <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => {setStatus(e.target.value); setError(null);}}
                            disabled={isSubmitting}
                            required
                            style={{...inputStyle, backgroundColor: '#e9ecef'}}
                        >
                            {availableStatuses.map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. NOTA DE GESTIÓN (Para Histórico) */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                            Nota Administrativa (Evento Histórico):
                        </label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Comentario para registrar el cambio de estado (Ej: Reasignado a soporte técnico)."
                            disabled={isSubmitting}
                            rows={3}
                            style={{...inputStyle, resize: "vertical"}}
                        />
                    </div>
                    
                    {/* 3. DESCRIPCIÓN DE LA QUEJA */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                            Descripción de la queja: <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => {setText(e.target.value); setError(null);}}
                            disabled={isSubmitting}
                            maxLength={1000}
                            required
                            style={{...inputStyle, height: "100px", resize: "vertical"}}
                        />
                        <small style={{ color: "#666", fontSize: "12px" }}>
                            {text.length} / 1000 caracteres
                        </small>
                    </div>
                    
                    {error && <p style={{ color: '#dc3545', margin: '10px 0', textAlign: 'center' }}>{error}</p>}

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            style={{...buttonBaseStyle, backgroundColor: "#6c757d", color: "white"}}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{...buttonBaseStyle, backgroundColor: "#4CAF50", color: "white"}}
                        >
                            {isSubmitting ? "Guardando..." : "Actualizar Gestión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditComplaintModal;