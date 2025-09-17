import { inject, Injectable } from '@angular/core';
import { Restaurant } from '../domain/restaurant';
import { RestaurantRepository } from '../domain/restaurant.repository';

@Injectable({ providedIn: 'root' })
export class GetRestaurantsUseCase {
  private readonly repo = inject(RestaurantRepository);

  execute(): Promise<Restaurant[]> {
    return this.repo.getAll();
  }
}
