import { apiClient } from "./client";

export async function fetchAssignments() {
  const response = await apiClient.get("/reels/assignments");
  return response.data; // массив логов отправки
}
