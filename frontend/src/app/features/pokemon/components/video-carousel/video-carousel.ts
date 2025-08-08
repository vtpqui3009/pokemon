import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Pokemon, PokemonFilters } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-video-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-carousel.html',
})
export class VideoCarouselComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  currentSlide = 0;
  videos = signal<any[]>([]);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getAndPaginatedPokemons();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.videos.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.videos.length) % this.videos.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://img.pokemondb.net/sprites/home/normal/pikachu.png';
  }

  private extractVideoId(url: string): string {
    const match = url.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : '';
  }

  private getAndPaginatedPokemons() {
    const params: PokemonFilters = {
      page: 1,
      limit: 4,
    };
    this.pokemonService
      .getAll(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemons) => {
        const additionalVideos = pokemons.data
          .filter((p) => p.youtubeUrl)
          .map((p) => ({
            title: `Pokémon ID ${p.id}`,
            thumbnail: `https://img.youtube.com/vi/${this.extractVideoId(
              p.youtubeUrl
            )}/maxresdefault.jpg`,
            id: p.id,
            url: p.youtubeUrl,
          }));

        this.videos.set([...additionalVideos]);
      });
  }
}
