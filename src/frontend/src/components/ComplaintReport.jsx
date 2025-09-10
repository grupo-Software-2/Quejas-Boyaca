import { useEffect, useState } from "react";
import axios from "axios";

function ComplaintReport({ entities, normalizeEntityName }) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("https://tallerquejas-production.up.railway.app/api/complaints")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err));
  }, []);

  const report = entities.map((ent) => ({
    entity: ent,
    count: complaints.filter((c) => c.entity === ent).length,
  }));

  return (
    <div>
      <h2>📊 Reporte de Quejas por Entidad</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Entidad</th>
            <th>Número de Quejas</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td>{normalizeEntityName(r.entity)}</td>
              <td>{r.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintReport;
