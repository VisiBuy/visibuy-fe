export interface Device {
  id: string;
  name: string;
  location: string;
  timestamp: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}
