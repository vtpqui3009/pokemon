import { Component, input, output, signal } from '@angular/core';
import { PaginationParams } from '../../models/pokemon.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pokemon-pagination.html',
})
export class PokemonPaginationComponent {
  page = signal(1);
  pageSize = signal(20);

  readonly pageSizes = [20, 50, 100];

  totalResults = input<number>(0);
  paginationChange = output<PaginationParams>();
  Math = Math;

  constructor() {
    console.log(this.pageSize());
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults() / this.pageSize());
  }

  setPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page.set(p);
    this.emitChange();
  }

  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(newSize);
    this.page.set(1);
    this.emitChange();
  }

  prevPage() {
    if (this.page() > 1) this.setPage(this.page() - 1);
  }

  nextPage() {
    if (this.page() < this.totalPages) this.setPage(this.page() + 1);
  }

  private emitChange() {
    this.paginationChange.emit({
      page: this.page(),
      pageSize: this.pageSize(),
    });
  }
}
