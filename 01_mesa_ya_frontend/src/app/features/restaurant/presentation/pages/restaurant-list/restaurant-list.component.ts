import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetRestaurantsUseCase } from '../../../application/get-restaurants.use-case';
import { Restaurant } from '../../../domain/restaurant';
import { RestaurantCardComponent } from '../../components/restaurant-card.component';
import { ReservationFormComponent } from '../../../../reservation/presentation/reservation-form.component';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent, ReservationFormComponent],
  template: `
    <section
      class="min-h-screen"
      style="background: var(--color-background); color: var(--color-paragraph)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header class="mb-8 flex items-end justify-between">
          <div>
            <h1 class="text-3xl font-bold" style="color: var(--color-title)">Restaurantes</h1>
            <p class="opacity-80">Explora y reserva tu mesa en los mejores lugares.</p>
          </div>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-restaurant-card
            *ngFor="let r of restaurants()"
            [restaurant]="r"
            (reserve)="onReserve($event)"
          />
        </div>
      </div>

      <ng-container *ngIf="selectedId() as id">
        <app-reservation-form
          *ngIf="getSelectedRestaurant(id) as selected"
          [restaurant]="selected"
          (closed)="selectedId.set(null)"
          (confirmed)="onConfirmReservation($event)"
        />
      </ng-container>
    </section>
  `,
})
export class RestaurantListComponent implements OnInit {
  private readonly getRestaurants = inject(GetRestaurantsUseCase);
  protected restaurants = signal<Restaurant[]>([]);
  protected selectedId = signal<string | null>(null);

  ngOnInit() {
    this.load();
  }

  private async load() {
    const data = await this.getRestaurants.execute();
    this.restaurants.set(data);
  }

  onReserve(id: string) {
    this.selectedId.set(id);
  }

  onConfirmReservation(payload: {
    restaurantId: string;
    date: string;
    time: string;
    people: number;
  }) {
    // For now, just close and log; could integrate to application layer later
    console.log('Reserva confirmada', payload);
    this.selectedId.set(null);
    alert('Reserva simulada con éxito');
  }

  getSelectedRestaurant(id: string): Restaurant | null {
    const list = this.restaurants();
    for (const r of list) if (r.id === id) return r;
    return null;
  }
}
