// src/api/auth.js

import { apiFetch } from "./client";

// src/api/client.ts
const API_URL = "http://localhost:8000";

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

export async function fetchMe() {
  const data = await apiFetch("/auth/me");
  // data: { id, email, role }
  return data;
}
