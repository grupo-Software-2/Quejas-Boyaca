import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const CaptchaForm = () => {
  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Por favor completa el captcha");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Captcha válido ✅");
    } else {
      alert("Captcha inválido ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={(token) => setCaptchaToken(token)}
        />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default CaptchaForm;
