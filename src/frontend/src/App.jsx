import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";
import ComplaintReport from "./components/ComplaintReport";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const { user, logout, loading, isAuthenticated } = useAuth();

  const entities = [
    "GOBERNACION_BOYACA",
    "SECRETARIA_EDUCACION",
    "SECRETARIA_SALUD",
    "ALCALDIA_TUNJA",
    "ALCALDIA_DUITAMA",
    "ALCALDIA_SOGAMOSO",
  ];

  const normalizeEntityName = (entityCode) => {
    const entityNames = {
      "GOBERNACION_BOYACA": "Gobernación de Boyacá",
      "SECRETARIA_EDUCACION": "Secretaría de Educación",
      "SECRETARIA_SALUD": "Secretaría de Salud",
      "ALCALDIA_TUNJA": "Alcaldía de Tunja",
      "ALCALDIA_DUITAMA": "Alcaldía de Duitama",
      "ALCALDIA_SOGAMOSO": "Alcaldía de Sogamoso",
    };
    return entityNames[entityCode] || entityCode.replace(/_/g, " ");
  };

  const [currentPage, setCurrentPage] = useState("form");
  const [authView, setAuthView] = useState("login");

  // Invitado por defecto solo para mostrar la pantalla inicial
  const [isGuest, setIsGuest] = useState(true);

  const [complaintToEdit, setComplaintToEdit] = useState(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "#1f1f1fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "900px",
        maxHeight: "90vh",
        overflowY: "auto",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        color: "#000"
      }}>

        {/* Barra superior */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ color: '#000' }}>
            {isAuthenticated && (
              <>
                <strong>Usuario:</strong> {user?.username}
              </>
            )}
          </div>

          {/* Botón de iniciar sesión (solo si está como invitado) */}
          {isGuest && (
            <button
              onClick={() => setIsGuest(false)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              Iniciar Sesión
            </button>
          )}

          {/* Botón Cerrar sesión SOLO si está autenticado */}
          {isAuthenticated && (
            <button
              onClick={logout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* Si NO es invitado y NO está logueado -> mostrar login o register */}
        {!isGuest && !isAuthenticated && (
          authView === "login" ? (
            <Login onSwitchToRegister={() => setAuthView("register")} />
          ) : (
            <Register onSwitchToLogin={() => setAuthView("login")} />
          )
        )}

        {/* Si es invitado O está autenticado */}
        {(isGuest || isAuthenticated) && (
          <>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
              Sistema de Registro de Quejas
            </h1>

            {/* Menú solo si NO es invitado */}
            {!isGuest && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "20px"
              }}>
                <button
                  onClick={() => setCurrentPage("list")}
                  style={{
                    margin: "5px",
                    padding: "12px 20px",
                    backgroundColor: currentPage === "list" ? "#4CAF50" : "#ddd",
                    color: currentPage === "list" ? "white" : "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Ver Quejas
                </button>

                <button
                  onClick={() => { setCurrentPage("form"); setComplaintToEdit(null); }}
                  style={{
                    margin: "5px",
                    padding: "12px 20px",
                    backgroundColor: currentPage === "form" ? "#4CAF50" : "#ddd",
                    color: currentPage === "form" ? "white" : "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Registrar Queja
                </button>

                <button
                  onClick={() => { setCurrentPage("report") }}
                  style={{
                    margin: "5px",
                    padding: "12px 20px",
                    backgroundColor: currentPage === "report" ? "#4CAF50" : "#ddd",
                    color: currentPage === "report" ? "white" : "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Reporte
                </button>
              </div>
            )}

            {currentPage === "form" && (
              <ComplaintForm
                entities={entities}
                normalizeEntityName={normalizeEntityName}
                complaintToEdit={complaintToEdit}
                onComplaintAdded={() => {
                  if (!isGuest) setCurrentPage("list");
                }}
              />
            )}

            {currentPage === "list" && !isGuest && (
              <ComplaintList
                entities={entities}
                normalizeEntityName={normalizeEntityName}
              />
            )}

            {currentPage === "report" && !isGuest && (
              <ComplaintReport
                entities={entities}
                normalizeEntityName={normalizeEntityName}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
