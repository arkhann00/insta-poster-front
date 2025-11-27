// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { login, getMe, registerUser } from "../api/auth";

function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        // Обычный логин
        const data = await login(email, password);
        localStorage.setItem("access_token", data.access_token);
        const me = await getMe();
        onLoginSuccess(me);
      } else {
        // Регистрация, потом автологин
        await registerUser(email, password, fullName);

        const data = await login(email, password);
        localStorage.setItem("access_token", data.access_token);
        const me = await getMe();
        onLoginSuccess(me);
      }
    } catch (err) {
      console.error(err);
      if (mode === "login") {
        setError("Неверный email или пароль");
      } else {
        setError("Не удалось зарегистрировать пользователя");
      }
      localStorage.removeItem("access_token");
    } finally {
      setSubmitting(false);
    }
  }

  const isLoginMode = mode === "login";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
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
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {isLoginMode ? "Вход в панель агентства" : "Регистрация сотрудника"}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {isLoginMode
            ? "Введи свои данные для входа в систему."
            : "Создай учётную запись для доступа к панели."}
        </p>

        {/* Переключатель режимов */}
        <div
          style={{
            display: "flex",
            marginBottom: 16,
            padding: 4,
            borderRadius: 999,
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 999,
              border: "none",
              fontSize: 14,
              cursor: submitting ? "default" : "pointer",
              backgroundColor: isLoginMode ? "#4f46e5" : "transparent",
              color: isLoginMode ? "#ffffff" : "#9ca3af",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 999,
              border: "none",
              fontSize: 14,
              cursor: submitting ? "default" : "pointer",
              backgroundColor: !isLoginMode ? "#4f46e5" : "transparent",
              color: !isLoginMode ? "#ffffff" : "#9ca3af",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {!isLoginMode && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  marginBottom: 4,
                  color: "#e5e7eb",
                }}
              >
                Имя сотрудника
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
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
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
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
            <label
              style={{
                display: "block",
                fontSize: 14,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
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
            {submitting
              ? isLoginMode
                ? "Входим..."
                : "Регистрируем..."
              : isLoginMode
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
