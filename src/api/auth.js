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

// Получение текущего пользователя по токену
export async function getMe() {
  const response = await apiClient.get("/auth/me");
  // { id, email, full_name, is_active }
  return response.data;
}
