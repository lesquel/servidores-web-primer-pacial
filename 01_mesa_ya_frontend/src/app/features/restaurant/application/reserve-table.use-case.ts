import { inject, Injectable } from '@angular/core';
import { RestaurantRepository } from '../domain/restaurant.repository';

@Injectable({ providedIn: 'root' })
export class ReserveTableUseCase {
  private readonly repo = inject(RestaurantRepository);
  execute(params: {
    restaurantId: string;
    tableId: string;
    date: string;
    time: string;
    people: number;
  }) {
    return this.repo.reserveTable(params);
  }
}
