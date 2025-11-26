// frontend/src/api/posts.js

import { USE_MOCKS, apiGet, apiPost, apiDelete } from "./base";
import {
  mockListPosts,
  mockCreatePost,
  mockDeletePost,
} from "../mocks/mockBackend";

// params: { accountId?: string, status?: string }
export async function listPosts(params = {}) {
  const { accountId, status } = params;

  if (USE_MOCKS) {
    return mockListPosts({
      accountId: accountId || null,
      status: status || null,
    });
  }

  const searchParams = new URLSearchParams();
  if (accountId) searchParams.append("account_id", accountId); // как ждёт бэк
  if (status) searchParams.append("status", status); // alias status_filter

  const query = searchParams.toString();
  const url = query ? `/posts?${query}` : "/posts";

  // apiGet уже сам подставляет API_URL и токен
  const data = await apiGet(url);
  return data;
}

export async function createPost(payload) {
  if (USE_MOCKS) {
    return mockCreatePost(payload);
  }
  // payload: { account_id, media_id, caption, tags, scheduled_at }
  return apiPost("/posts", payload);
}

export async function deletePost(id) {
  if (USE_MOCKS) {
    return mockDeletePost(id);
  }
  return apiDelete(`/posts/${id}`);
}
