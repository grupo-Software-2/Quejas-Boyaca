import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const CaptchaForm = ({ onVerify }) => {
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Por favor completa el captcha");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verify-captcha`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: captchaToken }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Captcha válido ✅");
        onVerify(true); // habilita lógica en el padre
      } else {
        alert("Captcha inválido ❌");
        onVerify(false);
      }
    } catch (err) {
      console.error("Error verificando captcha:", err);
      onVerify(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={setCaptchaToken}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default CaptchaForm;
