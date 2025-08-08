import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Layout } from '../../features/pokemon/components/layout/layout';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, Layout],
  template: `
    <app-layout>
      <main class="bg-[hsl(44,72%,97%)]">
        <router-outlet />
      </main>
    </app-layout>
  `,
})
export class MainLayoutComponent {}
