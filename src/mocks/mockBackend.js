// frontend/src/mocks/mockBackend.js

import { v4 as uuidv4 } from "uuid";

// ===== ПОЛЬЗОВАТЕЛЬ (для логина) =====

let mockUser = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "demo@agency.com",
  role: "admin",
  token: "mock-token-123",
};

export async function mockLogin(email, password) {
  // Можно добавить элементарную проверку, но для демо не обязательно
  return {
    id: mockUser.id,
    email: email || mockUser.email,
    role: mockUser.role,
    access_token: mockUser.token,
  };
}

// ===== АККАУНТЫ INSTAGRAM =====

let mockAccounts = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Main Blog",
    ig_user_id: "17841400000000001",
    access_token: "EAAG-DEMO-TOKEN-1",
    token_expires_at: "2026-01-01T00:00:00Z",
    created_at: "2025-11-01T10:00:00Z",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Side Project",
    ig_user_id: "17841400000000002",
    access_token: "EAAG-DEMO-TOKEN-2",
    token_expires_at: null,
    created_at: "2025-11-05T12:30:00Z",
  },
];

export async function mockListAccounts() {
  await new Promise((r) => setTimeout(r, 200));
  return mockAccounts.slice();
}

export async function mockCreateAccount(payload) {
  await new Promise((r) => setTimeout(r, 200));
  const acc = {
    id: uuidv4(),
    name: payload.name,
    ig_user_id: payload.ig_user_id,
    access_token: payload.access_token,
    token_expires_at: payload.token_expires_at,
    created_at: new Date().toISOString(),
  };
  mockAccounts.push(acc);
  return acc;
}

export async function mockDeleteAccount(id) {
  await new Promise((r) => setTimeout(r, 150));
  mockAccounts = mockAccounts.filter((a) => a.id !== id);
  return null;
}

// ===== МЕДИА (видео) =====

let mockMedia = [
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    account_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    filename: "demo_reel_1.mp4",
    mime: "video/mp4",
    size_bytes: 1234567,
    storage_provider: "local",
    storage_key: "media/demo_reel_1.mp4",
    created_at: "2025-11-10T09:00:00Z",
  },
];

export async function mockUploadMedia({ accountId, file }) {
  await new Promise((r) => setTimeout(r, 300));
  const asset = {
    id: uuidv4(),
    account_id: accountId,
    filename: file?.name || "mock_video.mp4",
    mime: file?.type || "video/mp4",
    size_bytes: file?.size || 111111,
    storage_provider: "local",
    storage_key: "media/mock_video.mp4",
    created_at: new Date().toISOString(),
  };
  mockMedia.push(asset);
  return asset;
}

export async function mockListMedia(accountId) {
  await new Promise((r) => setTimeout(r, 200));
  if (!accountId) return mockMedia.slice();
  return mockMedia.filter((m) => m.account_id === accountId);
}

export async function mockDeleteMedia(id) {
  await new Promise((r) => setTimeout(r, 150));
  mockMedia = mockMedia.filter((m) => m.id !== id);
  return null;
}

// ===== ПОСТЫ =====

let mockPosts = [
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    account_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    media_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    caption: "Первый демо-пост",
    tags: ["demo", "reels"],
    scheduled_at: null,
    status: "planned",
    attempt: 0,
    error: null,
    instagram_media_id: null,
    publish_started_at: null,
    published_at: null,
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: "2025-11-10T09:30:00Z",
    media_url: "/demo/demo_reel_1.mp4",
  },
];

export async function mockListPosts({ accountId, status }) {
  await new Promise((r) => setTimeout(r, 200));
  let posts = mockPosts.slice();
  if (accountId) {
    posts = posts.filter((p) => p.account_id === accountId);
  }
  if (status) {
    posts = posts.filter((p) => p.status === status);
  }
  posts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return posts;
}

export async function mockCreatePost(payload) {
  await new Promise((r) => setTimeout(r, 200));
  const newPost = {
    id: uuidv4(),
    account_id: payload.account_id,
    media_id: payload.media_id,
    caption: payload.caption,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    scheduled_at: payload.scheduled_at,
    status: "planned",
    attempt: 0,
    error: null,
    instagram_media_id: null,
    publish_started_at: null,
    published_at: null,
    created_by: "11111111-1111-1111-1111-111111111111",
    created_at: new Date().toISOString(),
    media_url: "/demo/mock_video.mp4",
  };
  mockPosts.push(newPost);
  return newPost;
}

export async function mockDeletePost(id) {
  await new Promise((r) => setTimeout(r, 150));
  mockPosts = mockPosts.filter((p) => p.id !== id);
  return null;
}
