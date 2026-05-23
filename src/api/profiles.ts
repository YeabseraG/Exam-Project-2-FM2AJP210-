import { apiFetch } from "./client";

interface ProfileResponse {
  data: any;
}

export function getProfile(name: string) {
  return apiFetch<ProfileResponse>(
    `/holidaze/profiles/${name}?_bookings=true&_venues=true`,
  );
}