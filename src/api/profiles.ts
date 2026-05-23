import { apiFetch } from "./client";
import type { Venue } from "../types/venue";

interface ProfileResponse {
  data: any;
}

interface ProfileVenuesResponse {
  data: Venue[];
}

interface UpdateProfilePayload {
  avatar: {
    url: string;
    alt: string;
  };
}

export function getProfile(name: string) {
  return apiFetch<ProfileResponse>(
    `/holidaze/profiles/${name}?_bookings=true&_venues=true`,
  );
}

export function getProfileVenues(name: string) {
  return apiFetch<ProfileVenuesResponse>(
    `/holidaze/profiles/${name}/venues?_bookings=true`,
  );
}

export function updateProfile(name: string, data: UpdateProfilePayload) {
  return apiFetch<ProfileResponse>(`/holidaze/profiles/${name}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}