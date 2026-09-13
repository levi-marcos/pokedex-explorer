import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ApiPokemonDetail } from '../../models/pokemon.models';
import { PokedexPage } from './pokedex';

const pikachu: ApiPokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' }, is_hidden: false }],
  stats: [{ base_stat: 90, stat: { name: 'speed' } }],
  sprites: { other: { 'official-artwork': { front_default: 'img.png' } } },
};

const bulbasaur: ApiPokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: [
    { slot: 1, type: { name: 'grass' } },
    { slot: 2, type: { name: 'poison' } },
  ],
  abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
  sprites: { other: { 'official-artwork': { front_default: 'bulba.png' } } },
};

const emptyList = { count: 1135, next: 'x', previous: null, results: [] };

describe('PokedexPage — busca', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PokedexPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function setup() {
    const fixture = TestBed.createComponent(PokedexPage);
    http.expectOne('https://pokeapi.co/api/v2/type').flush({ results: [] });
    http
      .expectOne((r) => r.url === 'https://pokeapi.co/api/v2/pokemon')
      .flush(emptyList);
    fixture.detectChanges();
    return fixture;
  }

  it('buscar por ID mostra o card do Pokémon sem recarregar o catálogo', () => {
    const fixture = setup();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const req = http.expectOne('https://pokeapi.co/api/v2/pokemon/25');
    expect(req.request.method).toBe('GET');
    req.flush(pikachu);
    fixture.detectChanges();

    const names = Array.from(fixture.nativeElement.querySelectorAll('.card__name')).map(
      (el) => (el as HTMLElement).textContent?.trim(),
    );
    expect(names).toEqual(['pikachu']);
  });

  it('voltar ao catálogo após busca inexistente recarrega a lista', () => {
    const fixture = setup();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const searchReq = http.expectOne('https://pokeapi.co/api/v2/pokemon/zzz');
    searchReq.flush('', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    const voltar = fixture.nativeElement.querySelector('.status__action') as HTMLButtonElement;
    expect(voltar).toBeTruthy();
    voltar.click();
    fixture.detectChanges();

    const listReq = http.expectOne((r) => r.url === 'https://pokeapi.co/api/v2/pokemon');
    expect(listReq.request.method).toBe('GET');
    listReq.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    });
    const detailReq = http.expectOne('https://pokeapi.co/api/v2/pokemon/1');
    detailReq.flush(bulbasaur);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('.status');
    expect(status).toBeNull();

    const names = Array.from(fixture.nativeElement.querySelectorAll('.card__name')).map(
      (el) => (el as HTMLElement).textContent?.trim(),
    );
    expect(names).toEqual(['bulbasaur']);
  });
});