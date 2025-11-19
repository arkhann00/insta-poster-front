// frontend/src/api/posts.js

import { USE_MOCKS, apiGet, apiPost, apiDelete } from "./base";
import {
  mockListPosts,
  mockCreatePost,
  mockDeletePost,
} from "../mocks/mockBackend";

export async function listPosts(params = {}) {
  if (USE_MOCKS) {
    return mockListPosts({
      accountId: params.accountId || null,
      status: params.status || null,
    });
  }

  const query = new URLSearchParams();
  if (params.accountId) query.set("account_id", params.accountId);
  if (params.status) query.set("status", params.status);

  return apiGet(`/posts?${query.toString()}`);
}

export async function createPost(payload) {
  if (USE_MOCKS) {
    return mockCreatePost(payload);
  }
  return apiPost("/posts", payload);
}

export async function deletePost(id) {
  if (USE_MOCKS) {
    return mockDeletePost(id);
  }
  return apiDelete(`/posts/${id}`);
}
