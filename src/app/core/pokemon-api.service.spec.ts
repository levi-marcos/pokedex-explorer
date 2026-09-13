import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type {
  ApiPokemonDetail,
  ApiPokemonListResponse,
  ApiTypeResponse,
} from '../models/pokemon.models';
import { PokemonApiService } from './pokemon-api.service';

describe('PokemonApiService', () => {
  let service: PokemonApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('carrega a lista com limit e offset', () => {
    service.getPokemonList(12, 24).subscribe((res) => expect(res.count).toBe(0));

    const req = http.expectOne((r) => r.url === 'https://pokeapi.co/api/v2/pokemon');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('12');
    expect(req.request.params.get('offset')).toBe('24');

    const list: ApiPokemonListResponse = { count: 0, next: null, previous: null, results: [] };
    req.flush(list);
  });

  it('carrega o detalhe de um Pokémon por nome', () => {
    service.getPokemon('pikachu').subscribe((res) => expect(res.name).toBe('pikachu'));

    const req = http.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'pikachu' } as ApiPokemonDetail);
  });

  it('carrega os Pokémon de um tipo', () => {
    service.getPokemonByType('fire').subscribe((res) => expect(res.pokemon.length).toBe(0));

    const req = http.expectOne('https://pokeapi.co/api/v2/type/fire');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'fire', pokemon: [] } as ApiTypeResponse);
  });

  it('lista os tipos disponíveis', () => {
    service.getTypes().subscribe((res) => expect(res.results.length).toBe(0));

    const req = http.expectOne('https://pokeapi.co/api/v2/type');
    expect(req.request.method).toBe('GET');
    req.flush({ results: [] });
  });
});