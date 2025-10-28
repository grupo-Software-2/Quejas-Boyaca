import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitchToRegister, onContinueAsGuest }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ username, password });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error de conexión, intenta más tarde");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#323232ff"
    }}>
      <div style={{
        width: "400px",
        padding: "30px",
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "10px", color: "#333" }}>Sistema de Quejas Boyacá</h1>
        <h2 style={{ marginBottom: "20px", color: "#555" }}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              color: "#000"
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              color: "#000"
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Validando..." : "Login"}
          </button>
          {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        </form>

        {/* Botón Continuar como invitado */}
        <button
          onClick={onContinueAsGuest}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "12px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Continuar como Invitado
        </button>

        {/* Enlace para registrarse */}
        <button
          onClick={onSwitchToRegister}
          style={{
            marginTop: "15px",
            background: "none",
            border: "none",
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
