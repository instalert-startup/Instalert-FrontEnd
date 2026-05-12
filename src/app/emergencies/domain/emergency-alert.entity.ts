export interface AlertHistory {
  id: number;
  type: string;
  location: string;
  time: string;
  status: string;
  statusClass: string;
}

export type PermissionState = 'pending' | 'granted' | 'denied';
export type DashboardState = 'idle' | 'active' | 'canceled';
