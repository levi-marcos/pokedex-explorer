import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  constructor() {
    const stored = sessionStorage.getItem('pokedex_redirect');
    if (stored) {
      sessionStorage.removeItem('pokedex_redirect');
      const path = new URL(stored).pathname.replace(/^\/pokedex-explorer/, '') || '/';
      this.router.navigateByUrl(path);
    }
  }
}