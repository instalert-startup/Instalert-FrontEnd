export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  currentLocation: string;
  avatar: string;
  phone: string;
  birthDate?: string;
  gender?: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  token: string;
}
