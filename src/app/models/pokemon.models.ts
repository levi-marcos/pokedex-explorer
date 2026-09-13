export interface ApiPokemonListEntry {
  name: string;
  url: string;
}

export interface ApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiPokemonListEntry[];
}

export interface ApiPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { other?: { 'official-artwork'?: { front_default: string | null } } };
}

export interface ApiTypeResponse {
  name: string;
  pokemon: { slot: number; pokemon: ApiPokemonListEntry }[];
}

export interface PokemonCard {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
}

export interface PokemonStat {
  label: string;
  value: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
  heightM: number;
  weightKg: number;
  abilities: string[];
  stats: PokemonStat[];
  description?: string | null;
  prevEvolution?: PokemonRef | null;
}

export interface PokemonRef {
  name: string;
  id: number;
}

export interface ApiPokemonSpecies {
  flavor_text_entries?: { flavor_text: string; language: { name: string } }[];
  evolves_from_species?: { name: string; url: string } | null;
}

export function pokemonIdFromUrl(url: string): number {
  const parts = url.replace(/\/+$/, '').split('/');
  return Number(parts[parts.length - 1]);
}

export function offsetFor(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export function padId(id: number): string {
  return String(id).padStart(4, '0');
}

export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SPA',
  'special-defense': 'SPD',
  speed: 'VEL',
};

export function statLabel(name: string): string {
  return STAT_LABELS[name] ?? name;
}

export function mapPokemonCard(detail: ApiPokemonDetail): PokemonCard {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: artworkUrl(detail.id),
    types: detail.types.map((t) => t.type.name),
  };
}

export function mapPokemonDetail(dto: ApiPokemonDetail): PokemonDetail {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: dto.sprites?.other?.['official-artwork']?.front_default ?? artworkUrl(dto.id),
    types: dto.types.map((t) => t.type.name),
    heightM: dto.height / 10,
    weightKg: dto.weight / 10,
    abilities: dto.abilities.map((a) => a.ability.name),
    stats: dto.stats.map((s) => ({ label: statLabel(s.stat.name), value: s.base_stat })),
  };
}

export function pickFlavorText(
  species: ApiPokemonSpecies,
  langs: string[] = ['pt', 'en'],
): string | null {
  const entries = species.flavor_text_entries ?? [];
  const clean = (text: string) => text.replace(/\s+/g, ' ').trim();
  for (const lang of langs) {
    const hit = entries.find((e) => e.language.name === lang);
    if (hit) {
      return clean(hit.flavor_text);
    }
  }
  return entries[0] ? clean(entries[0].flavor_text) : null;
}

export function prevEvolution(species: ApiPokemonSpecies): PokemonRef | null {
  const prev = species.evolves_from_species;
  return prev ? { name: prev.name, id: pokemonIdFromUrl(prev.url) } : null;
}