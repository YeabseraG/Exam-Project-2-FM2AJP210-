export interface CreateBookingPayload {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}