import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.html',
})
export class PokemonCardComponent {
  pokemon = input<Pokemon>();
  isFavorite = input<boolean>();
  toggleFavorite = output<number>();
  pokemonClick = output<number>();

  onPokemonClick() {
    if (this.pokemon()) {
      this.pokemonClick.emit(this.pokemon()!.id);
    }
  }
  onToggleFavorite() {
    if (this.pokemon()) {
      this.toggleFavorite.emit(this.pokemon()!.id);
    }
  }

  typeClass(type?: string) {
    if (type) {
      switch (type.toLowerCase()) {
        case 'fire':
          return 'bg-red-500 text-white';
        case 'water':
          return 'bg-blue-500 text-white';
        case 'grass':
          return 'bg-green-500 text-white';
        case 'poison':
          return 'bg-purple-500 text-white';
        case 'flying':
          return 'bg-sky-500 text-white';
        case 'psychic':
          return 'bg-pink-500 text-white';
        case 'dark':
          return 'bg-gray-800 text-white';
        case 'ice':
          return 'bg-cyan-500 text-white';
        case 'fairy':
          return 'bg-pink-300 text-white';
        case 'legendary':
          return 'bg-yellow-400 text-white';
        default:
          return 'bg-gray-300 text-black';
      }
    }
    return '';
  }
}
