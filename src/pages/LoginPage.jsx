import React, { useState } from "react";
import { login, getMe } from "../api/auth";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await login(email, password);
      localStorage.setItem("access_token", data.access_token);
      const me = await getMe();
      onLoginSuccess(me);
    } catch (err) {
      console.error(err);
      setError("Неверный email или пароль");
      localStorage.removeItem("access_token");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#020617",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #1e293b",
          boxShadow: "0 10px 40px rgba(15,23,42,0.8)",
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Вход в панель агентства
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </div>
          {error && (
            <div style={{ fontSize: 14, color: "#f97373" }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              backgroundColor: submitting ? "#4b5563" : "#4f46e5",
              color: "white",
              fontWeight: 500,
              cursor: submitting ? "default" : "pointer",
              transition: "background-color 0.15s",
            }}
          >
            {submitting ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
