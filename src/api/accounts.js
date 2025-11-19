// frontend/src/api/accounts.js

import { USE_MOCKS, apiGet, apiPost, apiDelete } from "./base";
import {
  mockListAccounts,
  mockCreateAccount,
  mockDeleteAccount,
} from "../mocks/mockBackend";

export async function listAccounts() {
  if (USE_MOCKS) {
    return mockListAccounts();
  }
  return apiGet("/accounts");
}

export async function createAccount(payload) {
  if (USE_MOCKS) {
    return mockCreateAccount(payload);
  }
  return apiPost("/accounts", payload);
}

export async function deleteAccount(id) {
  if (USE_MOCKS) {
    return mockDeleteAccount(id);
  }
  return apiDelete(`/accounts/${id}`);
}
