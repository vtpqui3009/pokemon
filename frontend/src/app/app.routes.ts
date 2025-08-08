import { Routes } from '@angular/router';
import { HomePageComponent } from './features/pokemon/pages/home/home';
import { PokemonListComponent } from './features/pokemon/pages/pokemon-list/pokemon-list';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthPageComponent } from './features/auth/auth';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: AuthPageComponent,
        title: 'Authentication',
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        title: 'Home',
      },
      {
        path: 'pokemons',
        component: PokemonListComponent,
        title: 'Pokémon List',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
