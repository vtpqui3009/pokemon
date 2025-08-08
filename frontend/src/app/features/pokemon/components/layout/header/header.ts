import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
})

export class HeaderComponent {
  navItems = [
    { path: "/", label: "Home", isActive: true },
    { path: "/pokemons", label: "Pokémon List", isActive: false },
  ];
}