export interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;

  media: {
    url: string;
    alt: string;
  }[];

  location: {
    city: string;
    country: string;
  };
}