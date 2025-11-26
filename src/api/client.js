// src/api/client.js

// Базовый URL твоего бэка.
// Если хочешь через env, ниже покажу, как.
export const API_URL = "https://api.xn--80a6ad.space";

// Общая обёртка над fetch, которую можно использовать во всех API-файлах.
export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;

  const token = localStorage.getItem("access_token");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || "GET",
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((d) => d.msg || JSON.stringify(d))
            .join("; ");
        }
      }
    } catch (e) {
      // если тело не json — оставляем дефолтное сообщение
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
