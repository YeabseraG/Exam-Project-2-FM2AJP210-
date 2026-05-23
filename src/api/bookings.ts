import { apiFetch } from "./client";
import type { CreateBookingPayload, Booking } from "../types/booking";

interface BookingResponse {
  data: Booking;
}

export function createBooking(payload: CreateBookingPayload) {
  return apiFetch<BookingResponse>("/holidaze/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}