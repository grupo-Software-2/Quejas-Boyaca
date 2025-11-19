import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.username.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    const { confirmPassword, ...userData } = formData;

    try {
      const result = await register(userData);
      if (result.success) {
        setSuccess(result.message || "Usuario registrado exitosamente");
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          fullName: ""
        });
        setTimeout(() => onSwitchToLogin(), 2000);
      } else {
        setError(result.message || "Error al registrar usuario");
      }
    } catch {
      setError("Error de conexión, intenta más tarde");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#323232ff"
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}
      >
        {/* Títulos */}
        <h1 style={{ marginBottom: "10px", color: "#333" }}>
          Sistema de Quejas Boyacá
        </h1>
        <h2 style={{ marginBottom: "20px", color: "#555" }}>
          Registro de Usuario
        </h2>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "15px" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Nombre Completo"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ ...inputStyle, paddingRight: "40px" }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                padding: "0"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={loading}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <button
          onClick={onSwitchToLogin}
          style={{
            marginTop: "15px",
            background: "none",
            border: "none",
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}
