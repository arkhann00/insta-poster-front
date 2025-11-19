// frontend/src/api/media.js

import { USE_MOCKS, API_URL, apiGet, apiDelete } from "./base";
import {
  mockUploadMedia,
  mockListMedia,
  mockDeleteMedia,
} from "../mocks/mockBackend";

export async function uploadMedia({ accountId, file }) {
  if (USE_MOCKS) {
    return mockUploadMedia({ accountId, file });
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("account_id", accountId);
  formData.append("file", file);

  const response = await fetch(`${API_URL}/media`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    let text = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) text = data.detail;
    } catch {
      // ignore
    }
    throw new Error(text);
  }

  return response.json();
}

export async function listMedia(params = {}) {
  if (USE_MOCKS) {
    return mockListMedia(params.accountId || null);
  }

  const query = new URLSearchParams();
  if (params.accountId) query.set("account_id", params.accountId);

  return apiGet(`/media?${query.toString()}`);
}

export async function deleteMedia(id) {
  if (USE_MOCKS) {
    return mockDeleteMedia(id);
  }
  return apiDelete(`/media/${id}`);
}
