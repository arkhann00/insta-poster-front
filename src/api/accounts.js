import { apiClient } from "./client";

// Получить список бизнес-аккаунтов текущего пользователя
export async function fetchAccounts() {
  const response = await apiClient.get("/accounts/");
  return response.data; // массив аккаунтов
}

// Создать новый бизнес-аккаунт
export async function createAccount({ name, external_id, access_token }) {
  const payload = {
    name,
    external_id: external_id || null,
    access_token: access_token || null,
    is_active: true,
  };

  const response = await apiClient.post("/accounts/", payload);
  return response.data; // созданный аккаунт (без токена в ответе)
}

// Удалить аккаунт
export async function deleteAccount(id) {
  await apiClient.delete(`/accounts/${id}`);
}
