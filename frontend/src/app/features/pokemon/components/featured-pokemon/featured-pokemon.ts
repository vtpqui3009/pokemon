import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pokemon, PokemonFilters } from '../../models/pokemon.model';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { PokemonDetailModalComponent } from '../pokemon-detail-modal/pokemon-detail-modal';

@Component({
  selector: 'app-featured-pokemon',
  imports: [CommonModule, PokemonCardComponent, PokemonDetailModalComponent],
    standalone: true,
  templateUrl: './featured-pokemon.html',
})

export class FeaturedPokemonComponent implements OnInit{
  private destroyRef = inject(DestroyRef);
  featuredPokemon = signal<Pokemon[]>([]);
  favorites = signal<Set<number>>(new Set());
  selectedPokemon = signal<Pokemon | null>(null);
  isModalOpen = signal(false);

  constructor(private pokemonService: PokemonService){}

  ngOnInit(): void {
    this.getAndPaginatedPokemons();
    this.getAllMyFavoritesPokemon();
  }

  handleFavorite(pokemonId: number): void {
    console.log(`Toggle favorite for Pokémon ${pokemonId}`);
  }

  handlePokemonClick(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon);
    this.isModalOpen.set(true);
  }

  toggleFavorite(pokemonId: number) {
      const isFav = this.favorites().has(pokemonId);

      if (isFav) {
        this.pokemonService
          .unmarkFavorite(pokemonId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            console.log('Unmark favorite successfully', pokemonId);
            this.getAllMyFavoritesPokemon();
          });
      } else {
        this.pokemonService
          .markFavorite(pokemonId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            console.log('Mark favorite successfully', pokemonId);
            this.getAllMyFavoritesPokemon();
          });
      }
    }

  private getAndPaginatedPokemons(){
    const params: PokemonFilters = {
      page: 1,
      limit: 10
    }
    this.pokemonService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pokemons => {
      this.featuredPokemon.set(pokemons.data);
    });
  }

  private getAllMyFavoritesPokemon(){
    this.pokemonService.getMyFavorites().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pokemons => {
      const favoriteIds = pokemons.map(item => item.id);
      this.favorites.update((() => new Set(favoriteIds)));
    });
  }
}
