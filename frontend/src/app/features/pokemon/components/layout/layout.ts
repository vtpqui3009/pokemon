import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-layout',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './layout.html',
  standalone: true,
  styleUrl: './layout.scss',
})
export class Layout {}
