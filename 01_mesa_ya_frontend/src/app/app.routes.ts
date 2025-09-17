import { Routes } from '@angular/router';
import { Home } from './features/home/presentation/pages/home/home';
import { RestaurantListComponent } from './features/restaurant/presentation/pages/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './features/restaurant/presentation/pages/restaurant-detail/restaurant-detail.component';
import { ContactComponent } from './features/contact/presentation/pages/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'restaurants', component: RestaurantListComponent },
  { path: 'restaurants/:id', component: RestaurantDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'restaurants' },
];
