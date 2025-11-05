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

  const [currentPage, setCurrentPage] = useState("home");
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [isGuest, setIsGuest] = useState(false);

  const [complaintToEdit, setComplaintToEdit] = useState(null);

  useEffect(() => {
    if (isGuest && currentPage === "home") {
      setCurrentPage("form");
    }
  }, [isGuest, currentPage]);

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

  if (!isAuthenticated && !isGuest) {
    return authView === "login" ? (
      <Login
        onSwitchToRegister={() => setAuthView("register")}
        onContinueAsGuest={() => setIsGuest(true)}
      />
    ) : (
      <Register onSwitchToLogin={() => setAuthView("login")} />
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
        width: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        {/* Barra de usuario */}
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
            <strong>Usuario:</strong> {isGuest ? 'Invitado' : user?.username || 'Usuario'}
            {!isGuest && user?.role === 'ADMIN' && (
              <span style={{
                marginLeft: '10px',
                padding: '3px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ADMIN
              </span>
            )}
          </div>
          <button
            onClick={() => { logout(); setIsGuest(false); }}
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
            {isGuest ? 'Salir' : 'Cerrar Sesión'}
          </button>
        </div>

        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
          Sistema de Registro de Quejas
        </h1>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "20px" }}>
          Bienvenido {isGuest ? "invitado" : user?.username}
        </p>

        {/* Mensaje informativo para invitados */}
        {isGuest && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#856404'
          }}>
            <strong>⚠️ Acceso limitado:</strong> Como invitado solo puedes registrar quejas.
            <br />
            <span style={{ fontSize: '14px' }}>
              Para ver reportes y gestionar quejas, inicia sesión.
            </span>
          </div>
        )}

        {/* Botones de navegación - SOLO PARA USUARIOS AUTENTICADOS */}
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
              Ver Quejas por Entidad
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
              {complaintToEdit ? "Editar Queja" : "Registrar Queja"}
            </button>

            <button
              onClick={() => { setCurrentPage("report"); setCaptchaPassed(false); }}
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
              Reporte de Quejas
            </button>
          </div>
        )}

        {/* Contenido dinámico */}
        {currentPage === "list" && !isGuest && (
          <ComplaintList
            entities={entities}
            normalizeEntityName={normalizeEntityName}
            onEdit={(complaint) => {
              setComplaintToEdit(complaint);
              setCurrentPage("form");
            }}
          />
        )}

        {currentPage === "form" && (
          <ComplaintForm
            entities={entities}
            normalizeEntityName={normalizeEntityName}
            complaintToEdit={complaintToEdit}
            onComplaintAdded={() => {
              if (isGuest) {
                // El invitado se queda en el formulario
                alert("Queja registrada con éxito. Puedes registrar otra queja o salir.");
              } else {
                // Usuario autenticado va a la lista
                setCurrentPage("list");
                setComplaintToEdit(null);
              }
            }}
          />
        )}

        {currentPage === "report" && !isGuest && (
          captchaPassed ? (
            <ComplaintReport
              entities={entities}
              normalizeEntityName={normalizeEntityName}
            />
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #ddd",
              textAlign: "center"
            }}>
              <h3 style={{ color: "#000" }}>
                Verifica que no eres un robot antes de ver el reporte
              </h3>
              <CaptchaForm onVerify={setCaptchaPassed} />
            </div>
          )
        )}

        {currentPage === "home" && !isGuest && (
          <p style={{ textAlign: "center" }}>Selecciona una opción para comenzar.</p>
        )}

        {/* Mensaje si invitado intenta acceder a páginas restringidas */}
        {isGuest && (currentPage === "list" || currentPage === "report") && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            textAlign: 'center',
            color: '#721c24'
          }}>
            <h3>🚫 Acceso Denegado</h3>
            <p>Esta sección solo está disponible para usuarios registrados.</p>
            <button
              onClick={() => { setIsGuest(false); logout(); }}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
