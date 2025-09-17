import { inject, Injectable } from '@angular/core';
import { Restaurant } from '../domain/restaurant';
import { RestaurantRepository } from '../domain/restaurant.repository';

@Injectable({ providedIn: 'root' })
export class GetRestaurantByIdUseCase {
  private readonly repo = inject(RestaurantRepository);
  execute(id: string): Promise<Restaurant | null> {
    return this.repo.getById(id);
  }
}
