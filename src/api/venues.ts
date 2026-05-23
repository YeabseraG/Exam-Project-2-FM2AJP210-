import { apiFetch } from "./client";
import type { Venue } from "../types/venue";

interface VenuesResponse {
  data: Venue[];
}

interface VenueResponse {
  data: Venue;
}

export interface VenuePayload {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: {
    url: string;
    alt: string;
  }[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
  };
}

export function getVenues() {
  return apiFetch<VenuesResponse>("/holidaze/venues");
}

export function getVenueById(id: string) {
  return apiFetch<VenueResponse>(`/holidaze/venues/${id}?_bookings=true`);
}

export function createVenue(data: VenuePayload) {
  return apiFetch<VenueResponse>("/holidaze/venues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateVenue(id: string, data: VenuePayload) {
  return apiFetch<VenueResponse>(`/holidaze/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteVenue(id: string) {
  return apiFetch(`/holidaze/venues/${id}`, {
    method: "DELETE",
  });
}