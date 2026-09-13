import { describe, expect, it } from 'vitest';
import type { ApiPokemonDetail, ApiPokemonSpecies } from './pokemon.models';
import {
  mapPokemonCard,
  mapPokemonDetail,
  offsetFor,
  pickFlavorText,
  pokemonIdFromUrl,
  prevEvolution,
  statLabel,
} from './pokemon.models';

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

describe('funções puras do domínio', () => {
  it('extrai o id da URL da API', () => {
    expect(pokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('calcula o offset de uma página', () => {
    expect(offsetFor(1, 12)).toBe(0);
    expect(offsetFor(3, 12)).toBe(24);
  });

  it('rotula os stats da API', () => {
    expect(statLabel('special-attack')).toBe('SPA');
    expect(statLabel('speed')).toBe('VEL');
  });

  it('converte altura e peso (decímetro/hectograma para metro/quilo)', () => {
    const detail = mapPokemonDetail(pikachu);
    expect(detail.heightM).toBe(0.4);
    expect(detail.weightKg).toBe(6);
  });

  it('mapeia o detalhe para a visão usada na tela', () => {
    const detail = mapPokemonDetail(pikachu);
    expect(detail.id).toBe(25);
    expect(detail.types).toEqual(['electric']);
    expect(detail.abilities).toEqual(['static']);
    expect(detail.stats[0]).toMatchObject({ label: 'VEL', value: 90 });
  });

  it('constrói o cartão a partir do detalhe da API', () => {
    const card = mapPokemonCard(pikachu);
    expect(card.id).toBe(25);
    expect(card.name).toBe('pikachu');
    expect(card.types).toEqual(['electric']);
    expect(card.imageUrl).toContain('25.png');
  });

  it('extrai o texto de descrição preferindo pt, depois en', () => {
    const species: ApiPokemonSpecies = {
      flavor_text_entries: [
        { flavor_text: 'Quando vários\nse juntam,\na eletricidade fica mais forte.', language: { name: 'en' } },
      ],
      evolves_from_species: null,
    };
    expect(pickFlavorText(species)).toMatch(/Quando vários se juntam, a eletricidade fica mais forte/);
  });

  it('retorna null quando a espécie não tem texto de descrição', () => {
    expect(pickFlavorText({})).toBeNull();
  });

  it('extrai a evolução anterior da espécie', () => {
    const species: ApiPokemonSpecies = {
      evolves_from_species: { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon-species/172/' },
    };
    expect(prevEvolution(species)).toEqual({ name: 'pichu', id: 172 });
    expect(prevEvolution({})).toBeNull();
  });
});