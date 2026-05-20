import { apiFetch } from "./client";
import type { LoginResponse } from "../types/auth";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function registerUser(payload: RegisterPayload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/auth/login?_holidaze=true", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}