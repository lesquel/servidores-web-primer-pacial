import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GetRestaurantByIdUseCase } from '../../../application/get-restaurant-by-id.use-case';
import { Restaurant, TableSpot } from '../../../domain/restaurant';
import { ReservationFormComponent } from '../../../../reservation/presentation/reservation-form.component';
import { ReserveTableUseCase } from '../../../application/reserve-table.use-case';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, ReservationFormComponent],
  template: `
    <section
      class="min-h-screen"
      style="background: var(--color-background); color: var(--color-paragraph)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" *ngIf="restaurant() as r">
        <header class="mb-6">
          <h1 class="text-3xl font-bold" style="color: var(--color-title)">{{ r.name }}</h1>
          <p class="opacity-80">
            {{ r.location }} • ⏰ {{ r.schedule }} • ⭐ {{ r.rating ?? '4.5' }}
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            class="lg:col-span-2 rounded-xl border border-white/10 shadow"
            style="background: var(--color-surface)"
          >
            <div class="p-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold" style="color: var(--color-title)">
                Plano del local
              </h2>
              <a
                class="text-sm underline"
                [href]="'https://www.google.com/maps/search/?api=1&query=' + enc(r.location)"
                target="_blank"
                >Ver mapa</a
              >
            </div>
            <div class="p-4">
              <div
                class="relative"
                [style.aspectRatio]="
                  (r.floorPlan?.width || 600) + ' / ' + (r.floorPlan?.height || 400)
                "
              >
                <svg
                  [attr.viewBox]="
                    '0 0 ' + (r.floorPlan?.width || 600) + ' ' + (r.floorPlan?.height || 400)
                  "
                  class="w-full h-auto rounded-lg"
                >
                  <rect
                    x="0"
                    y="0"
                    [attr.width]="r.floorPlan?.width || 600"
                    [attr.height]="r.floorPlan?.height || 400"
                    fill="rgba(255,255,255,0.02)"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <ng-container *ngFor="let t of r.floorPlan?.tables || []">
                    <g (click)="selectTable(t)" style="cursor: pointer">
                      <circle
                        [attr.cx]="(t.x / 100) * (r.floorPlan?.width || 600)"
                        [attr.cy]="(t.y / 100) * (r.floorPlan?.height || 400)"
                        r="18"
                        [attr.fill]="t.available ? '#16a34a' : '#a1a1aa'"
                      />
                      <!-- chairs: small rectangles around the table -->
                      <ng-container *ngFor="let c of [].constructor(t.seats); let i = index">
                        <rect
                          [attr.x]="chairX(i, t, r)"
                          [attr.y]="chairY(i, t, r)"
                          width="8"
                          height="8"
                          [attr.fill]="
                            t.available ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'
                          "
                          [attr.transform]="chairRotate(i, t, r)"
                          rx="1"
                        />
                      </ng-container>
                      <text
                        [attr.x]="(t.x / 100) * (r.floorPlan?.width || 600)"
                        [attr.y]="(t.y / 100) * (r.floorPlan?.height || 400) + 5"
                        text-anchor="middle"
                        font-size="12"
                        fill="#fff"
                      >
                        {{ t.seats }}
                      </text>
                    </g>
                  </ng-container>
                </svg>
              </div>
              <div class="mt-3 text-sm">Selecciona una mesa verde disponible. Gris = ocupada.</div>
            </div>
          </div>

          <aside
            class="rounded-xl border border-white/10 shadow p-4"
            style="background: var(--color-surface)"
          >
            <h3 class="text-lg font-semibold mb-3" style="color: var(--color-title)">Menú</h3>
            <ul class="space-y-3">
              <li *ngFor="let m of r.menu" class="flex items-center justify-between">
                <div>
                  <div class="font-medium" style="color: var(--color-title)">{{ m.name }}</div>
                  <div class="text-xs opacity-80">#{{ m.id }}</div>
                </div>
                <div class="flex items-center gap-3">
                  <img [src]="m.image" class="w-12 h-12 rounded object-cover" alt="{{ m.name }}" />
                  <div class="font-semibold">{{ m.price | currency : 'USD' : 'symbol' }}</div>
                </div>
              </li>
            </ul>
          </aside>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <button
            class="px-5 py-2.5 rounded-lg"
            style="background: var(--color-primary); color: #fff;"
            [disabled]="!selectedTable()"
            (click)="openReservation()"
          >
            Reservar mesa {{ selectedTable()?.id || '' }}
          </button>
          <div class="text-sm opacity-80">
            {{
              selectedTable()
                ? 'Mesa ' + selectedTable()?.id + ' • ' + selectedTable()?.seats + ' personas'
                : 'Elige una mesa en el plano'
            }}
          </div>
        </div>
      </div>

      <app-reservation-form
        *ngIf="reservationOpen()"
        [restaurant]="restaurant()"
        (closed)="reservationOpen.set(false)"
        (confirmed)="confirmReservation($event)"
      />
    </section>
  `,
})
export class RestaurantDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getById = inject(GetRestaurantByIdUseCase);
  private readonly reserveTable = inject(ReserveTableUseCase);
  protected restaurant = signal<Restaurant | null>(null);
  protected selectedTable = signal<TableSpot | null>(null);
  protected reservationOpen = signal(false);
  protected enc = encodeURIComponent;

  // Helpers to place chairs around a table in a circle
  chairX(i: number, t: TableSpot, r: Restaurant) {
    const W = r.floorPlan?.width ?? 600;
    const radius = 26; // distance from center
    const angle = (i / Math.max(1, t.seats)) * 2 * Math.PI;
    const cx = (t.x / 100) * W;
    return cx + radius * Math.cos(angle) - 4; // center rect (8 width)
  }

  chairY(i: number, t: TableSpot, r: Restaurant) {
    const H = r.floorPlan?.height ?? 400;
    const radius = 26;
    const angle = (i / Math.max(1, t.seats)) * 2 * Math.PI;
    const cy = (t.y / 100) * H;
    return cy + radius * Math.sin(angle) - 4; // center rect (8 height)
  }

  chairRotate(i: number, t: TableSpot, r: Restaurant) {
    const W = r.floorPlan?.width ?? 600;
    const H = r.floorPlan?.height ?? 400;
    const angleDeg = (i / Math.max(1, t.seats)) * 360;
    const cx = (t.x / 100) * W;
    const cy = (t.y / 100) * H;
    return `rotate(${angleDeg}, ${cx}, ${cy})`;
  }

  ngOnInit() {
    this.load();
  }
  private async load() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const r = await this.getById.execute(id);
    this.restaurant.set(r);
  }

  selectTable(t: TableSpot) {
    if (!t.available) return;
    this.selectedTable.set(t);
  }

  openReservation() {
    this.reservationOpen.set(true);
  }

  async confirmReservation(evt: {
    restaurantId: string;
    date: string;
    time: string;
    people: number;
  }) {
    const r = this.restaurant();
    const t = this.selectedTable();
    if (!r || !t) return;
    const res = await this.reserveTable.execute({
      restaurantId: r.id,
      tableId: t.id,
      date: evt.date,
      time: evt.time,
      people: evt.people,
    });
    if (res.success) {
      this.reservationOpen.set(false);
      // refresh mock state
      const updated = await this.getById.execute(r.id);
      this.restaurant.set(updated);
      this.selectedTable.set(null);
      alert('Reserva confirmada');
    } else {
      alert('No se pudo reservar la mesa');
    }
  }
}
