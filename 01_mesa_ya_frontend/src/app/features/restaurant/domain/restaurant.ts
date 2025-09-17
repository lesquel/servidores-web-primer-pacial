export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface TableSpot {
  id: string;
  x: number; // 0..100 (%)
  y: number; // 0..100 (%)
  seats: number;
  available: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string; // address string
  lat?: number;
  lng?: number;
  menu: MenuItem[];
  schedule: string;
  availableTables: number;
  rating?: number;
  isOpen?: boolean;
  floorPlan?: {
    width: number; // arbitrary canvas width for SVG
    height: number; // arbitrary canvas height for SVG
    tables: TableSpot[];
  };
}
