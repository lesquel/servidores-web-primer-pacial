import { Injectable } from '@angular/core';
import { Restaurant } from '../domain/restaurant';
import { RestaurantRepository } from '../domain/restaurant.repository';

// Mock data source (could be replaced by HTTP later)
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Restaurante Falso',
    location: 'Av. Principal 123, Manta',
    lat: -0.962, // mock coords
    lng: -80.713,
    menu: [
      { id: 'm1', name: 'Ceviche falso', price: 5.99, image: 'https://picsum.photos/200' },
      { id: 'm2', name: 'Arroz con pescado fake', price: 8.5, image: 'https://picsum.photos/201' },
    ],
    schedule: 'Lun-Dom 10:00 - 22:00',
    availableTables: 5,
    rating: 4.7,
    isOpen: true,
    floorPlan: {
      width: 600,
      height: 400,
      tables: [
        { id: 't1', x: 15, y: 20, seats: 2, available: true },
        { id: 't2', x: 35, y: 25, seats: 4, available: true },
        { id: 't3', x: 60, y: 30, seats: 4, available: false },
        { id: 't4', x: 80, y: 50, seats: 6, available: true },
      ],
    },
  },
  {
    id: '2',
    name: 'Marisquería La Perla',
    location: 'Calle 10 y Av. Malecón, Manta',
    menu: [
      { id: 'm1', name: 'Camarones apanados', price: 7.99, image: 'https://picsum.photos/202' },
      { id: 'm2', name: 'Encocado de pescado', price: 9.5, image: 'https://picsum.photos/203' },
    ],
    schedule: 'Lun-Dom 11:00 - 23:00',
    availableTables: 3,
    rating: 4.6,
    isOpen: true,
    floorPlan: {
      width: 620,
      height: 420,
      tables: [
        { id: 't1', x: 20, y: 30, seats: 2, available: true },
        { id: 't2', x: 45, y: 40, seats: 4, available: true },
        { id: 't3', x: 70, y: 35, seats: 4, available: true },
      ],
    },
  },
  {
    id: '3',
    name: 'Café Cultural',
    location: 'Barrio Centro, Manta',
    menu: [
      { id: 'm1', name: 'Capuccino', price: 2.5, image: 'https://picsum.photos/204' },
      { id: 'm2', name: 'Tarta de maracuyá', price: 3.75, image: 'https://picsum.photos/205' },
    ],
    schedule: 'Lun-Dom 16:00 - 22:00',
    availableTables: 0,
    rating: 4.9,
    isOpen: false,
    floorPlan: {
      width: 580,
      height: 380,
      tables: [
        { id: 't1', x: 25, y: 25, seats: 2, available: false },
        { id: 't2', x: 50, y: 55, seats: 4, available: false },
      ],
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class RestaurantHttpRepository implements RestaurantRepository {
  async getAll(): Promise<Restaurant[]> {
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 300));
    return MOCK_RESTAURANTS;
  }

  async getById(id: string): Promise<Restaurant | null> {
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_RESTAURANTS.find((r) => r.id === id) ?? null;
  }

  async reserveTable(params: {
    restaurantId: string;
    tableId: string;
    date: string;
    time: string;
    people: number;
  }): Promise<{ success: boolean }> {
    await new Promise((res) => setTimeout(res, 250));
    const r = MOCK_RESTAURANTS.find((x) => x.id === params.restaurantId);
    if (!r?.floorPlan) {
      return { success: false };
    }
    const t = r.floorPlan.tables.find((tb) => tb.id === params.tableId);
    if (!t || !t.available || params.people > t.seats) {
      return { success: false };
    }
    t.available = false;
    r.availableTables = Math.max(0, r.availableTables - 1);
    return { success: true };
  }
}
