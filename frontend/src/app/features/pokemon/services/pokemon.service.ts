import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  PaginatedPokemon,
  Pokemon,
  PokemonFilters,
} from '../models/pokemon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    'https://vigilant-fishstick-74x5jjpprp7fwxx9-3000.app.github.dev/pokemon';

  getAll(filterParams: PokemonFilters): Observable<PaginatedPokemon> {
    let params = new HttpParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<PaginatedPokemon>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${id}`);
  }

  importFile(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/import`, formData);
  }

  markFavorite(pokemonId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${pokemonId}/favorite`, {});
  }
  unmarkFavorite(pokemonId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${pokemonId}/unfavorite`, {});
  }

  getMyFavorites(): Observable<Array<Pokemon>> {
    return this.http.get<Array<Pokemon>>(`${this.baseUrl}/favorites/me`);
  }
}
