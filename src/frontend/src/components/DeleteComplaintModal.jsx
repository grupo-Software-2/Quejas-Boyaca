import { useState } from "react";

function DeleteComplaintModal({ complaint, onConfirm, onCancel, isDeleting }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Por favor, ingrese la contraseña.");
      return;
    }
    onConfirm(password);
  };

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
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          color: "#000",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: "#dc3545" }}>⚠️ Confirmar Eliminación</h2>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            borderLeft: "4px solid #dc3545",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>
            <strong>Queja a eliminar:</strong>
          </p>
          <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
            {complaint?.text.substring(0, 100)}
            {complaint?.text.length > 100 ? "..." : ""}
          </p>
        </div>

        <p style={{ color: "#666", fontSize: "14px" }}>
          Esta acción ocultará la queja del sistema. Ingrese la contraseña de administrador para continuar:
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Contraseña de Administrador:
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese la contraseña"
                disabled={isDeleting}
                style={{
                  width: "100%",
                  padding: "10px",
                  paddingRight: "40px",
                  fontSize: "14px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.6 : 1,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.6 : 1,
              }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Queja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteComplaintModal;
