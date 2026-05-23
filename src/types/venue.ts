export interface VenueMedia {
  url: string;
  alt: string;
}

export interface VenueLocation {
  city: string;
  country: string;
}

export interface VenueBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;

  media: VenueMedia[];

  location: VenueLocation;

  bookings?: VenueBooking[];
}