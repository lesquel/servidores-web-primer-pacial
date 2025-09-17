import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../restaurant/domain/restaurant';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl border border-white/10"
        style="background: var(--color-surface); color: var(--color-paragraph)"
      >
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 class="font-semibold" style="color: var(--color-title)">
            Reserva en {{ restaurant?.name }}
          </h3>
          <button (click)="closed.emit()" class="text-paragraph/70 hover:text-white">✕</button>
        </div>
        <form class="p-4 space-y-4" (ngSubmit)="submit()">
          <div class="grid grid-cols-2 gap-3">
            <label class="text-sm"
              >Fecha
              <input
                type="date"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                [(ngModel)]="date"
                name="date"
                required
              />
            </label>
            <label class="text-sm"
              >Hora
              <input
                type="time"
                class="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2"
                [(ngModel)]="time"
                name="time"
                required
              />
            </label>
          </div>
          <label class="text-sm"
            >Personas
            <input
              type="number"
              min="1"
              class="mt-1 w-full bg-white/5 border border-white/10 rounded px-3 py-2"
              [(ngModel)]="people"
              name="people"
              required
            />
          </label>
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              (click)="closed.emit()"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg"
              style="background: var(--color-primary); color: #fff;"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ReservationFormComponent {
  @Input() restaurant: Restaurant | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<{
    restaurantId: string;
    date: string;
    time: string;
    people: number;
  }>();

  date = '';
  time = '';
  people = 2;

  submit() {
    if (!this.restaurant) return;
    this.confirmed.emit({
      restaurantId: this.restaurant.id,
      date: this.date,
      time: this.time,
      people: this.people,
    });
  }
}
