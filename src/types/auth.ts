export interface User {
  name: string;
  email: string;
  avatar?: {
    url: string;
    alt: string;
  };
  venueManager: boolean;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    name: string;
    email: string;
    avatar?: {
      url: string;
      alt: string;
    };
    venueManager: boolean;
  };
}