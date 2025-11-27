import { apiClient } from "./client";

// Список всех рилсов текущего пользователя
export async function fetchReels() {
  const response = await apiClient.get("/reels/");
  return response.data; // массив рилсов
}

// Загрузка одного рилса (если где-то нужно по одному)
export async function uploadReel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/reels/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// Массовая загрузка рилсов (несколько файлов)
export async function uploadReelsBulk(files) {
  const formData = new FormData();
  files.forEach((file) => {
    // имя "files" должно совпадать с параметром в FastAPI
    formData.append("files", file);
  });

  const response = await apiClient.post("/reels/bulk", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // массив созданных рилсов
}

// Удаление рилса
export async function deleteReel(id) {
  await apiClient.delete(`/reels/${id}`);
}

// Запуск выкладки "1 рилс на 1 аккаунт"
export async function publishReels() {
  const response = await apiClient.post("/reels/publish");
  return response.data;
}
