// frontend/src/api/base.js

export const API_URL = "https://api.xn--80a6ad.space";

// Флаг, который решает: ходим на настоящий бэк или используем моки
export const USE_MOCKS = false;

// ====== РЕАЛЬНЫЙ HTTP-КЛИЕНТ (используется только если USE_MOCKS === false) ======

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;

  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorText = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        errorText = data.detail;
      }
    } catch {
      // оставляем errorText как есть
    }
    throw new Error(errorText);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function apiGet(path) {
  return request(path, { method: "GET" });
}

export function apiPost(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiDelete(path) {
  return request(path, {
    method: "DELETE",
  });
}
