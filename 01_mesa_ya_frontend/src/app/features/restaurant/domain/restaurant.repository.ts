import { Restaurant } from './restaurant';

export abstract class RestaurantRepository {
  abstract getAll(): Promise<Restaurant[]>;
  abstract getById(id: string): Promise<Restaurant | null>;
  abstract reserveTable(params: {
    restaurantId: string;
    tableId: string;
    date: string;
    time: string;
    people: number;
  }): Promise<{ success: boolean }>;
}
