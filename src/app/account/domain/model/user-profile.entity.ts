export interface UserProfile {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  currentLocation: string;
  avatar: string;
  phone: string;
  birthDate?: string;
  gender?: string;
}
