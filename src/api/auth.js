// src/api/auth.js
import { apiClient } from "./client";

// Логин: отправляем форму на /api/auth/login
export async function login(email, password) {
  const formData = new URLSearchParams();

  // backend ждёт поле "username", мы кладём туда email
  formData.append("username", email);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const response = await apiClient.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // { access_token: "...", token_type: "bearer" }
  return response.data;
}

// Регистрация пользователя на /api/auth/register
// Тело бэка: { email, password, full_name }
export async function registerUser(email, password, fullName) {
  const payload = {
    email: email,
    password: password,
    full_name: fullName,
  };

  const response = await apiClient.post("/auth/register", payload);
  // backend возвращает данные пользователя (без токена)
  return response.data;
}

// Получение текущего пользователя по токену
export async function getMe() {
  const response = await apiClient.get("/auth/me");
  // { id, email, full_name, is_active }
  return response.data;
}
