import { apiFetch } from "./client";
import type { Venue } from "../types/venue";

interface VenuesResponse {
  data: Venue[];
}

interface VenueResponse {
  data: Venue;
}

export function getVenues() {
  return apiFetch<VenuesResponse>(
    "/holidaze/venues",
  );
}

export function getVenueById(id: string) {
  return apiFetch<VenueResponse>(
    `/holidaze/venues/${id}?_bookings=true`,
  );
}