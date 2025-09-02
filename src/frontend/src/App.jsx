import { useState } from "react";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";
import ComplaintReport from "./components/ComplaintReport";
import ReCAPTCHA from "./components/CaptchaForm";

function App() {
  // Entidades deben coincidir con los ENUM en tu backend
  const entities = [
    "GOBERNACION_BOYACA",
    "SECRETARIA_EDUCACION",
    "SECRETARIA_SALUD",
    "ALCALDIA_TUNJA",
    "ALCALDIA_DUITAMA",
    "ALCALDIA_SOGAMOSO",
  ];

  const [currentPage, setCurrentPage] = useState("home");
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const handleCaptcha = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setCaptchaPassed(true);
      } else {
        alert("Captcha inválido. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error verificando captcha:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>📌 Sistema de Registro de Quejas</h1>

      {/* Botones de navegación */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => {
            setCurrentPage("list");
            setCaptchaPassed(false);
          }}
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
          onClick={() => {
            setCurrentPage("form");
            setCaptchaPassed(false);
          }}
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
            setCaptchaPassed(false); // cada vez que entre al reporte debe validar captcha
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
      {currentPage === "list" && <ComplaintList entities={entities} />}
      {currentPage === "form" && (
        <ComplaintForm entities={entities} onComplaintAdded={() => setCurrentPage("list")} />
      )}
      {currentPage === "report" && !captchaPassed && (
        <div>
          <h3>⚠️ Verifica que no eres un robot antes de ver el reporte</h3>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // clave del sitio
            onChange={handleCaptcha}
          />
        </div>
      )}
      {currentPage === "report" && captchaPassed && <ComplaintReport entities={entities} />}
      {currentPage === "home" && <p>👈 Selecciona una opción para comenzar.</p>}
    </div>
  );
}

export default App;
