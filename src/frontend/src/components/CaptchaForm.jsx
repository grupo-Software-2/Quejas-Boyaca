import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const CaptchaForm = ({ onVerify }) => {
  const [captchaToken, setCaptchaToken] = useState("");
  const [siteKey, setSiteKey] = useState("");

  useEffect(() => {
    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      setSiteKey(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
    } else {
      console.error("❌ No se encontró la sitekey de ReCAPTCHA");
    }
  }, []);

  const handleToken = (token) => setCaptchaToken(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Por favor completa el captcha");
      onVerify(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Captcha válido ✅");
        onVerify(true);
      } else {
        alert("Captcha inválido ❌");
        onVerify(false);
      }
    } catch (err) {
      console.error("Error verificando captcha:", err);
      onVerify(false);
    }
  };

  if (!siteKey) return <p>Cargando captcha...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
        onChange={handleToken}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default CaptchaForm;
