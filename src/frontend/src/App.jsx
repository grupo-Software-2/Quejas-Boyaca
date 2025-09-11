import { useState } from "react";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";
import ComplaintReport from "./components/ComplaintReport";
import CaptchaForm from "./components/CaptchaForm";

function App() {
  
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
            setCaptchaPassed(false); // ✅ ahora sí existe
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
