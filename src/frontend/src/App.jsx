import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import ComplaintForm from "./components/ComplaintForm.jsx";
import ComplaintListByEntity from "./components/ComplaintListByEntity.jsx"; 
import ComplaintReport from "./components/ComplaintReport.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  const { user, logout, loading, isAuthenticated, isAdmin } = useAuth();

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
  const [authView, setAuthView] = useState("login");
  const [isGuest, setIsGuest] = useState(false);

  const [complaintToEdit, setComplaintToEdit] = useState(null);
  
  useEffect(() => {
    if (isGuest && currentPage === "home") {
      setCurrentPage("form");
    }
  }, [isGuest, currentPage]);
  
  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
        setCurrentPage('home');
    }
  }, [isAuthenticated, isGuest]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#fff', 
        backgroundColor: '#1f1f1fff'
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
        width: "850px", 
        maxHeight: "95vh",
        overflowY: "auto",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        color: "#333" 
      }}>
        
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
            {isAdmin && (
              <span style={{
                marginLeft: '10px',
                padding: '3px 8px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ADMINISTRADOR
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
          Sistema de Gestión de Quejas
        </h1>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "20px" }}>
          Bienvenido {isGuest ? "invitado" : user?.username}
        </p>

       
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
              Para gestión y reportes, inicia sesión como Administrador.
            </span>
          </div>
        )}

       
        {isAdmin && (
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
                backgroundColor: currentPage === "list" ? "#007bff" : "#ddd",
                color: currentPage === "list" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Gestión de Quejas
            </button>

            <button
              onClick={() => { setCurrentPage("form"); setComplaintToEdit(null); }}
              style={{
                margin: "5px",
                padding: "12px 20px",
                backgroundColor: currentPage === "form" ? "#007bff" : "#ddd",
                color: currentPage === "form" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Registrar Queja
            </button>

            <button
              onClick={() => { setCurrentPage("report")}}
              style={{
                margin: "5px",
                padding: "12px 20px",
                backgroundColor: currentPage === "report" ? "#007bff" : "#ddd",
                color: currentPage === "report" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Reporte Detallado
            </button>
          </div>
        )}
        
      
        {currentPage === "list" && isAdmin && (
          <ComplaintListByEntity
            entities={entities}
            normalizeEntityName={normalizeEntityName}
          />
        )}

        {currentPage === "form" && (
          <ComplaintForm
            entities={entities}
            normalizeEntityName={normalizeEntityName}
            complaintToEdit={complaintToEdit}
            onComplaintAdded={() => {
                setCurrentPage("list");
                setComplaintToEdit(null);
            }}
          />
        )}

        {currentPage === "report" && isAdmin && (
          <ComplaintReport
            entities={entities}
            normalizeEntityName={normalizeEntityName}
          />
        )}

        {currentPage === "home" && !isGuest && isAuthenticated && (
          <p style={{ textAlign: "center", color: "#333" }}>Selecciona una opción para comenzar la gestión.</p>
        )}
        
        
        {isAuthenticated && !isAdmin && (currentPage === "home" || currentPage === "list" || currentPage === "report") && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            textAlign: 'center',
            color: '#721c24'
          }}>
            <h3> Acceso Restringido</h3>
            <p>Solo los usuarios Administradores pueden acceder a esta sección de gestión y reportes.</p>
          </div>
        )}
        
        
      </div>
      <style>{`
        /* Estilo global para el scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            background-color: #f5f5f5;
        }

        ::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #ccc;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: #999;
        }
      `}</style>
    </div>
  );
}

export default App;