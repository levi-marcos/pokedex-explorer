import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonApiService } from '../../core/pokemon-api.service';
import type { PokemonDetail } from '../../models/pokemon.models';
import { artworkUrl, mapPokemonDetail, padId, pickFlavorText, prevEvolution } from '../../models/pokemon.models';

@Component({
  selector: 'pokemon-detail-page',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PokemonApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly pokemon = signal<PokemonDetail | null>(null);
  protected readonly padId = padId;
  protected readonly artworkUrl = artworkUrl;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.api.getPokemon(id).subscribe({
      next: (dto) => {
        const detail = mapPokemonDetail(dto);
        this.pokemon.set(detail);
        this.loadSpecies(detail.id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  private loadSpecies(id: number): void {
    this.api.getPokemonSpecies(id).subscribe({
      next: (species) => {
        this.pokemon.update((current) =>
          current
            ? {
                ...current,
                description: pickFlavorText(species),
                prevEvolution: prevEvolution(species),
              }
            : current,
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}