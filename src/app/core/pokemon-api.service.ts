import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  ApiPokemonDetail,
  ApiPokemonListResponse,
  ApiPokemonSpecies,
  ApiTypeResponse,
} from '../models/pokemon.models';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  getPokemonList(limit: number, offset: number): Observable<ApiPokemonListResponse> {
    return this.http.get<ApiPokemonListResponse>(`${this.baseUrl}/pokemon`, {
      params: { limit, offset },
    });
  }

  getPokemon(idOrName: string | number): Observable<ApiPokemonDetail> {
    return this.http.get<ApiPokemonDetail>(`${this.baseUrl}/pokemon/${idOrName}`);
  }

  getPokemonSpecies(idOrName: string | number): Observable<ApiPokemonSpecies> {
    return this.http.get<ApiPokemonSpecies>(`${this.baseUrl}/pokemon-species/${idOrName}`);
  }

  getTypes(): Observable<{ results: { name: string; url: string }[] }> {
    return this.http.get<{ results: { name: string; url: string }[] }>(`${this.baseUrl}/type`);
  }

  getPokemonByType(type: string): Observable<ApiTypeResponse> {
    return this.http.get<ApiTypeResponse>(`${this.baseUrl}/type/${type}`);
  }
}