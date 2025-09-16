import { useState, useEffect } from "react";
import axios from "axios";

function ComplaintListByEntity({ entities, normalizeEntityName }) {
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [complaints, setComplaints] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    axios
      .get(`${API_URL}/api/complaints/${selectedEntity}`)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error(err));
  }, [selectedEntity]);

  return (
    <div>
      <label>Seleccione una entidad:</label>
      <select
        value={selectedEntity}
        onChange={(e) => setSelectedEntity(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        {entities.map((ent, i) => (
          <option key={i} value={ent}>
            {normalizeEntityName(ent)}
          </option>
        ))}
      </select>

      <h2>📑 Quejas registradas para: {normalizeEntityName(selectedEntity)}</h2>
      {complaints.length === 0 ? (
        <p>No hay quejas registradas para esta entidad.</p>
      ) : (
        <ul>
          {complaints.map((c) => (
            <li key={c.id} style={{ marginBottom: "10px" }}>
              <strong>Queja:</strong> {c.text} <br />
              <small>📅 {c.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComplaintListByEntity;
