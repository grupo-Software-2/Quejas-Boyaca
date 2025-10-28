import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";
import ComplaintReport from "./components/ComplaintReport";
import CaptchaForm from "./components/CaptchaForm";
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
  }

  const [currentPage, setCurrentPage] = useState("home");
  const [captchaPassed, setCaptchaPassed] = useState(false); // ✅ añadido
  const [authView, setAuthView] = useState("login");

    useEffect(() => {
    const handleUnauthorized = () => {
      // Forzamos mostrar login
      setAuthView("login");
      setCurrentPage("home");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);


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

  if (!isAuthenticated) {
    return authView === "login" ? (
      <Login onSwitchToRegister={() => setAuthView("register")} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
          <strong>👤 Usuario:</strong> {user?.username || 'Usuario'}
          {user?.role === 'ADMIN' && (
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
          🚪 Cerrar Sesión
        </button>
      </div>

      <h1>📌 Sistema de Registro de Quejas</h1>

      {/* Botones de navegación */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setCurrentPage("list")}
          style={{
            margin: "5px",
            padding: "10px",
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
          onClick={() => setCurrentPage("form")}
          style={{
            margin: "5px",
            padding: "10px",
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
          onClick={() => {
            setCurrentPage("report");
            setCaptchaPassed(false);
          }}
          style={{
            margin: "5px",
            padding: "10px",
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

      {/* Contenido dinámico */}
      {currentPage === "list" && (
        <ComplaintList 
          entities={entities} 
          normalizeEntityName={normalizeEntityName}
        />)}
      {currentPage === "form" && (
        <ComplaintForm
          entities={entities}
          normalizeEntityName={normalizeEntityName}
          onComplaintAdded={() => setCurrentPage("list")}
        />
      )}
      {currentPage === "report" && (
        captchaPassed ? (
          <ComplaintReport 
            entities={entities}
            normalizeEntityName={normalizeEntityName}
          />
        ) : (
          <div>
            <h3>⚠️ Verifica que no eres un robot antes de ver el reporte</h3>
            <CaptchaForm onVerify={setCaptchaPassed} />
          </div>
        )
      )}

      {currentPage === "home" && <p>👈 Selecciona una opción para comenzar.</p>}
    </div>
  );
}

export default App;
