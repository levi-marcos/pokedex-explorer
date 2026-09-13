import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card';
import { PokemonApiService } from '../../core/pokemon-api.service';
import type { PokemonCard } from '../../models/pokemon.models';
import { artworkUrl, mapPokemonCard, offsetFor, pokemonIdFromUrl } from '../../models/pokemon.models';

@Component({
  selector: 'pokedex-page',
  imports: [FormsModule, PokemonCardComponent],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class PokedexPage {
  private readonly api = inject(PokemonApiService);
  private readonly pageSize = 12;

  protected readonly page = signal(1);
  protected readonly total = signal(0);
  protected readonly mode = signal<'catalog' | 'filter' | 'search'>('catalog');
  protected readonly pokemons = signal<PokemonCard[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly notFound = signal(false);
  protected readonly query = signal('');
  protected readonly types = signal<string[]>([]);
  protected readonly selectedTypes = signal<string[]>([]);

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));

  constructor() {
    this.loadCatalog();
    this.api.getTypes().subscribe({
      next: (res) =>
        this.types.set(res.results.map((t) => t.name).filter((t) => t !== 'unknown' && t !== 'shadow')),
    });
  }

  protected loadCatalog(): void {
    this.mode.set('catalog');
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.api.getPokemonList(this.pageSize, offsetFor(this.page(), this.pageSize)).subscribe({
      next: (res) => {
        this.total.set(res.count);
        if (res.results.length === 0) {
          this.pokemons.set([]);
          this.loading.set(false);
          return;
        }
        const details = res.results.map((item) => this.api.getPokemon(pokemonIdFromUrl(item.url)));
        forkJoin(details).subscribe({
          next: (dtos) => {
            this.pokemons.set(dtos.map((dto) => mapPokemonCard(dto)));
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.error.set('Falha ao detalhar os cartões da página.');
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível carregar a lista de Pokémon.');
      },
    });
  }

  protected changePage(next: number): void {
    if (next < 1 || next > this.totalPages()) {
      return;
    }
    this.page.set(next);
    if (this.mode() === 'filter') {
      this.applyTypeFilter();
    } else {
      this.loadCatalog();
    }
  }

  protected onSearch(): void {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      this.clearSearch();
      return;
    }
    this.mode.set('search');
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.api.getPokemon(q).subscribe({
      next: (dto) => {
        this.mode.set('search');
        this.pokemons.set([mapPokemonCard(dto)]);
        this.total.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Não foi possível buscar este Pokémon.');
        }
      },
    });
  }

  protected clearSearch(): void {
    this.query.set('');
    this.page.set(1);
    if (this.mode() === 'search') {
      this.loadCatalog();
    }
  }

  protected toggleType(type: string): void {
    this.selectedTypes.update((sel) =>
      sel.includes(type) ? sel.filter((t) => t !== type) : [...sel, type],
    );
    this.page.set(1);
    if (this.selectedTypes().length === 0) {
      this.loadCatalog();
      return;
    }
    this.applyTypeFilter();
  }

  private applyTypeFilter(): void {
    this.mode.set('filter');
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    const selected = this.selectedTypes();
    forkJoin(selected.map((type) => this.api.getPokemonByType(type))).subscribe({
      next: (responses) => {
        const byId = new Map<number, { name: string; url: string; types: string[] }>();
        responses.forEach((res, index) => {
          res.pokemon.forEach((p) => {
            const id = pokemonIdFromUrl(p.pokemon.url);
            const current = byId.get(id);
            if (current) {
              current.types.push(selected[index]);
            } else {
              byId.set(id, { name: p.pokemon.name, url: p.pokemon.url, types: [selected[index]] });
            }
          });
        });
        const all = [...byId.values()].sort((a, b) => pokemonIdFromUrl(a.url) - pokemonIdFromUrl(b.url));
        this.total.set(all.length);
        const start = offsetFor(this.page(), this.pageSize);
        this.pokemons.set(
          all.slice(start, start + this.pageSize).map((p) => {
            const id = pokemonIdFromUrl(p.url);
            return { id, name: p.name, imageUrl: artworkUrl(id), types: p.types };
          }),
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível aplicar o filtro de tipos.');
      },
    });
  }
}