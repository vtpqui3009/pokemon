import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail-modal',
  templateUrl: './pokemon-detail-modal.html',
  imports: [CommonModule],
  standalone: true,
})
export class PokemonDetailModalComponent {
  @Input() pokemon: Pokemon | null = null;
  @Input() isOpen = false;
  @Input() isFavorite = false;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<number>();

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      Normal: 'bg-gray-400',
      Fire: 'bg-red-500',
      Water: 'bg-blue-500',
      Electric: 'bg-yellow-400',
      Grass: 'bg-green-500',
      Ice: 'bg-blue-200',
      Fighting: 'bg-red-700',
      Poison: 'bg-purple-500',
      Ground: 'bg-yellow-600',
      Flying: 'bg-indigo-400',
      Psychic: 'bg-pink-500',
      Bug: 'bg-green-400',
      Rock: 'bg-yellow-800',
      Ghost: 'bg-purple-700',
      Dragon: 'bg-indigo-700',
      Dark: 'bg-gray-800',
      Steel: 'bg-gray-500',
      Fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  }

  stats(pokemon: Pokemon) {
    console.log(pokemon);
    return [
      { name: 'HP', value: pokemon.hp, max: pokemon.total },
      { name: 'Attack', value: pokemon.attack, max: pokemon.total },
      { name: 'Defense', value: pokemon.defense, max: pokemon.total },
      { name: 'Sp. Attack', value: pokemon.spAttack, max: pokemon.total },
      { name: 'Sp. Defense', value: pokemon.spDefense, max: pokemon.total },
      { name: 'Speed', value: pokemon.speed, max: pokemon.total },
    ];
  }

  onToggleFavorite(id: number) {
    this.toggleFavorite.emit(id);
  }

  onClose() {
    this.close.emit();
  }
}
