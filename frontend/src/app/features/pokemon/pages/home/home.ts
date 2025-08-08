import { Component } from '@angular/core';
import { FeaturedPokemonComponent } from '../../components/featured-pokemon/featured-pokemon';
import { VideoCarouselComponent } from '../../components/video-carousel/video-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [VideoCarouselComponent, FeaturedPokemonComponent],
  templateUrl: './home.html',
})
export class HomePageComponent {}
