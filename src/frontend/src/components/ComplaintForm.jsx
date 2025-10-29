import { useState } from "react";
import { complaintsAPI } from "../services/api";

function ComplaintForm({ entities, onComplaintAdded, normalizeEntityName }) {
  const [entity, setEntity] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entity) {
      alert("Por favor, selecciona una entidad.");
      return;
    }

    if (!text.trim() || text.length > 1000) {
      alert("La queja no puede estar vacía y debe tener máximo 1000 caracteres.");
      return;
    }

    try {
      const response = await complaintsAPI.createComplaint({
        entity,
        text,
      });

      alert("Queja registrada con éxito.");
      setText("");
      setEntity("");
      onComplaintAdded(response.data);
    } catch (error) {
      console.error(error);
      alert("Error al registrar la queja.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>Registrar Nueva Queja</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          Entidad: <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#000',
            cursor: 'pointer'
          }}
        >
          <option value="" disabled style={{ color: '#555' }}>
            Seleccione una entidad
          </option>
          {entities.map((ent, i) => (
            <option key={i} value={ent} style={{ color: '#000' }}>
              {normalizeEntityName(ent)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          Descripción de la queja: <span style={{ color: 'red' }}>*</span>
        </label>
        <textarea
          placeholder="Redacta tu queja (máximo 1000 caracteres)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          required
          style={{
            width: '100%',
            height: '150px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        <small style={{ color: '#666', fontSize: '12px' }}>
          {text.length} / 1000 caracteres
        </small>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Registrar Queja
      </button>
    </form>
  );
}

export default ComplaintForm;
