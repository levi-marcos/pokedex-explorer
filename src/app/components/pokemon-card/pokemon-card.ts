import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PokemonCard } from '../../models/pokemon.models';
import { padId } from '../../models/pokemon.models';

@Component({
  selector: 'pokemon-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCardComponent {
  readonly card = input.required<PokemonCard>();
  protected readonly padId = padId;
}