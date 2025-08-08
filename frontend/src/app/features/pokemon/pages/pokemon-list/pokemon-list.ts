import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card';
import { PokemonDetailModalComponent } from '../../components/pokemon-detail-modal/pokemon-detail-modal';
import { PokemonFiltersComponent } from '../../components/pokemon-filters/pokemon-filters';
import { PokemonPaginationComponent } from '../../components/pokemon-pagination/pokemon-pagination';
import {
  PaginationParams,
  Pokemon,
  PokemonFilters,
} from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PokemonFiltersComponent,
    PokemonDetailModalComponent,
    PokemonPaginationComponent,
  ],
  templateUrl: './pokemon-list.html',
})
export class PokemonListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  pokemonList = signal<Pokemon[]>([]);
  filters = signal<PokemonFilters>({ page: 1, limit: 20 });

  totalItems = signal<number>(0);
  selectedPokemon = signal<Pokemon | null>(null);
  isModalOpen = signal(false);
  favorites = signal<Set<number>>(new Set());

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initQueryParams();
    this.getAndPaginatedPokemons();
    this.getAllMyFavoritesPokemon();
  }

  private applyFilters(pokemon: Pokemon[]): Pokemon[] {
    const filters = this.filters() || {};

    return pokemon.filter((p) => {
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.type &&
        filters.type !== '' &&
        p.type1 !== filters.type &&
        p.type2 !== filters.type
      ) {
        return false;
      }
      if (
        typeof filters.legendary === 'boolean' &&
        p.legendary !== filters.legendary
      ) {
        return false;
      }
      if (filters.minSpeed !== undefined && p.speed < filters.minSpeed) {
        return false;
      }
      if (filters.maxSpeed !== undefined && p.speed > filters.maxSpeed) {
        return false;
      }
      return true;
    });
  }

  handleFilter(filter: PokemonFilters) {
    this.filters.update((prevFilters) => ({
      ...prevFilters,
      ...filter,
    }));
    this.getAndPaginatedPokemons();
  }

  handlePokemonClick(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon);
    this.isModalOpen.set(true);
  }

  handleImportClick(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.pokemonService
      .importFile(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {});
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

  handlePaginate(event: PaginationParams) {
    this.filters.update((prevFilters) => ({
      ...prevFilters,
      page: event.page,
      limit: event.pageSize,
    }));
    this.getAndPaginatedPokemons();
  }

  private getAndPaginatedPokemons() {
    const filters = this.filters(); // grab current filters

    this.pokemonService
      .getAll(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemons) => {
        let results = pokemons.data;

        // Optional: apply client-side filtering
        results = this.applyFilters(results);

        this.pokemonList.set(results);
        this.totalItems.set(pokemons.total);
      });
  }

  private getAllMyFavoritesPokemon() {
    this.pokemonService
      .getMyFavorites()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemons) => {
        const favoriteIds = pokemons.map((item) => item.id);
        this.favorites.update(() => new Set(favoriteIds));
      });
  }

  private initQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length === 0) {
        return;
      }
      this.filters.set(params);
    });
  }
}
