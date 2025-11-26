// src/pages/RegisterPage.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Не удалось зарегистрироваться. Попробуй ещё раз.";
      setError(message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "16px",
          backgroundColor: "#020617",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          Регистрация
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            marginBottom: "20px",
          }}
        >
          Создай аккаунт, чтобы войти.
        </p>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#451a1a",
              color: "#fecaca",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "6px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              marginBottom: "12px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "6px",
            }}
          >
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              marginBottom: "20px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: loading ? "#1d4ed8aa" : "#1d4ed8",
              color: "#e5e7eb",
              border: "none",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              marginBottom: "12px",
            }}
          >
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            marginTop: "8px",
          }}
        >
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
            }}
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
