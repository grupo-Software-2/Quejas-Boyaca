import { useState } from "react";
import axios from "axios";

function ComplaintForm({ entities, onComplaintAdded }) {
  const [entity, setEntity] = useState(entities[0]);
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || text.length > 1000) {
      alert("❌ La queja no puede estar vacía y debe tener máximo 1000 caracteres.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/complaints", {
        entity,
        text,
      });

      alert("✅ Queja registrada con éxito.");
      setText("");

      // notificar al padre
      onComplaintAdded(response.data);
    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar la queja.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Entidad:</label>
      <select
        value={entity}
        onChange={(e) => setEntity(e.target.value)}
        style={{ margin: "10px", padding: "5px" }}
      >
        {entities.map((ent, i) => (
          <option key={i} value={ent}>
            {ent}
          </option>
        ))}
      </select>

      <br />
      <textarea
        placeholder="Redacta tu queja (máx 1000 caracteres)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        required
        style={{ width: "100%", height: "120px", marginTop: "10px", padding: "10px" }}
      />
      <br />
      <button type="submit" style={{ marginTop: "10px", padding: "10px 15px" }}>
        Registrar
      </button>
    </form>
  );
}

export default ComplaintForm;
