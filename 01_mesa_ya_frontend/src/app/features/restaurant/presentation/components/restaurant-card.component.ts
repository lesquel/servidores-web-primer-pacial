import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../../domain/restaurant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article
      class="bg-surface text-paragraph rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition transform duration-200 overflow-hidden border border-white/5"
    >
      <div class="relative">
        <img
          [src]="(restaurant.menu[0] && restaurant.menu[0].image) || 'https://picsum.photos/200'"
          [alt]="restaurant.name"
          class="w-full h-44 object-cover"
        />
        <div class="absolute top-3 left-3">
          <span
            class="px-2.5 py-1 rounded-full text-xs font-medium"
            [ngClass]="restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-zinc-700 text-gray-200'"
          >
            {{ restaurant.isOpen ? 'Abierto' : 'Cerrado' }}
          </span>
        </div>
        <div class="absolute top-3 right-3">
          <span
            class="bg-white/90 text-zinc-900 px-2.5 py-1 rounded-full text-xs font-medium shadow"
            >⭐ {{ restaurant.rating ?? '4.5' }}</span
          >
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-1" style="color: var(--color-title)">
          <a [routerLink]="['/restaurants', restaurant.id]">{{ restaurant.name }}</a>
        </h3>
        <p class="text-paragraph/80 text-sm mb-3">{{ restaurant.location }}</p>
        <p class="text-xs opacity-80 mb-3">⏰ {{ restaurant.schedule }}</p>

        <div class="flex flex-wrap gap-2 text-sm mb-4">
          <ng-container *ngFor="let item of restaurant.menu | slice : 0 : 3; let last = last">
            <span class="bg-white/5 border border-white/10 text-paragraph/90 px-2 py-1 rounded"
              >{{ item.name }}
              <span class="text-paragraph/70"
                >• {{ item.price | currency : 'USD' : 'symbol' : '1.2-2' }}</span
              ></span
            >
          </ng-container>
        </div>

        <div class="flex items-center justify-between">
          <span
            class="text-sm"
            [ngClass]="restaurant.availableTables > 0 ? 'text-green-400' : 'text-amber-400'"
          >
            {{
              restaurant.availableTables > 0
                ? restaurant.availableTables + ' mesas disponibles'
                : 'Sin mesas disponibles'
            }}
          </span>
          <a
            class="px-3 py-2 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/10"
            [href]="
              'https://www.google.com/maps/search/?api=1&query=' +
              encodeURIComponent(restaurant.location)
            "
            target="_blank"
            rel="noopener noreferrer"
            >Ver mapa</a
          >
          <a
            class="btn-primary"
            [routerLink]="['/restaurants', restaurant.id]"
            [class.pointer-events-none]="!restaurant.availableTables"
            [attr.aria-disabled]="!restaurant.availableTables ? true : null"
            >Reservar</a
          >
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .btn-primary {
        background: var(--color-primary);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background-color 0.2s ease;
      }
      .btn-primary:hover {
        filter: brightness(0.95);
      }
      .btn-primary:disabled {
        background: #52525b;
        cursor: not-allowed;
      }
    `,
  ],
})
export class RestaurantCardComponent {
  @Input({ required: true }) restaurant!: Restaurant;
  @Output() reserve = new EventEmitter<string>();
  protected encodeURIComponent = (globalThis as any).encodeURIComponent as (s: string) => string;
}
