export interface TrustedContact {
  id: number;
  userId: number;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifyOnAlert: boolean;
}
