import { useEffect, useState } from "react";
import { complaintsAPI } from "../services/api";

function ComplaintReport({ entities, normalizeEntityName }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    complaintsAPI.getAllComplaints()
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar quejas:", err);
        setComplaints([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const report = entities.map((ent) => ({
    entity: ent,
    count: complaints.filter((c) => c.entity === ent).length,
  }));

  const totalComplaints = complaints.length;

  if (loading) {
    return <div>
      <h2>Reporte de Quejas por Entidad</h2>
      <p>Cargando datos...</p>
    </div>;
  }

  return (
    <div>
      <h2>📊 Reporte de Quejas por Entidad</h2>
      
      {totalComplaints === 0 ? (
        <p>No hay quejas registradas en el sistema.</p>
      ) : (
        <>
          <p style={{ marginBottom: "20px", fontWeight: "bold" }}>
            Total de quejas activas: {totalComplaints}
          </p>
          
          <table 
            border="1" 
            cellPadding="8" 
            style={{ 
              borderCollapse: "collapse",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#fff",
              color: "#000"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th style={{ textAlign: "left", color: "#000" }}>Entidad</th>
                <th style={{ textAlign: "center", color: "#000" }}>Número de Quejas</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ color: "#000" }}>{normalizeEntityName(r.entity)}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}>
                    {r.count}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
                <td style={{ color: "#000" }}>TOTAL</td>
                <td style={{ textAlign: "center", color: "#000" }}>{totalComplaints}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ComplaintReport;
