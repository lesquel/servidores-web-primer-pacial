import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RestaurantRepository } from './features/restaurant/domain/restaurant.repository';
import { RestaurantHttpRepository } from './features/restaurant/infrastructure/restaurant-http.repository';
import { UserRepository } from './features/user/domain/user.repository';
import { UserLocalRepository } from './features/user/infrastructure/user-local.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: RestaurantRepository, useExisting: RestaurantHttpRepository },
    { provide: UserRepository, useExisting: UserLocalRepository },
  ],
};
