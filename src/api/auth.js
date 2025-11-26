// src/api/auth.js

import { apiFetch } from "./client";
import { API_URL } from "./base";

// src/api/client.ts

export async function loginRequest(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail ?? `Login failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function registerRequest(email, password) {
  // Бэк ожидает тело формата { email, password }
  const data = await fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  // Формат ответа такой же, как и у логина:
  // {
  //   "id": "...",
  //   "email": "...",
  //   "role": "...",
  //   "access_token": "..."
  // }
  return data;
}

export async function fetchMe() {
  const data = await apiFetch("/auth/me");
  // data: { id, email, role }
  return data;
}
