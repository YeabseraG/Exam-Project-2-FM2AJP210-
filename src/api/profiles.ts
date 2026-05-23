import { apiFetch } from "./client";
import type { Venue } from "../types/venue";

interface ProfileResponse {
  data: any;
}

interface ProfileVenuesResponse {
  data: Venue[];
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