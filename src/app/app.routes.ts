import { Routes } from '@angular/router';
import { PokemonDetailPage } from './pages/pokemon-detail/pokemon-detail';
import { PokedexPage } from './pages/pokedex/pokedex';

export const routes: Routes = [
  { path: '', component: PokedexPage },
  { path: 'pokemon/:id', component: PokemonDetailPage },
  { path: '**', redirectTo: '' },
];