import { Component, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PokemonFilters } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pokemon-filters.html',
})
export class PokemonFiltersComponent implements OnInit {
  filters = input<any>({});
  filtersChange = output<PokemonFilters>();
  importFile = output<File>();
  searchControl = new FormControl('');

  searchText = '';
  selectedType = '';
  legendaryOnly = false;
  minSpeed?: number;
  maxSpeed?: number;

  isAdvanced = signal(false);
  types = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dark',
    'Dragon',
    'Steel',
    'Fairy',
  ];

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // wait 300ms after user stops typing
      .subscribe((value) => {
        this.searchText = String(value);
        this.filtersChange.emit({ search: this.searchText });
      });
  }

  toggleAdvanced() {
    this.isAdvanced.set(!this.isAdvanced());
  }

  showResults() {
    this.emitFilters();
  }

  handleImportCsvFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.importFile.emit(files[0]);
    }
  }

  setType(type: string) {
    this.selectedType = type;
  }

  setLegendary(value: 'all' | 'regular' | 'legendary') {
    if (value === 'all') {
      this.legendaryOnly = undefined as any;
    } else if (value === 'legendary') {
      this.legendaryOnly = true;
    } else {
      this.legendaryOnly = false;
    }
  }

  setSpeedMin(value: number) {
    this.minSpeed = value;
  }

  setSpeedMax(value: number) {
    this.maxSpeed = value;
  }

  resetFilters() {
    this.searchText = '';
    this.selectedType = '';
    this.legendaryOnly = undefined as any;
    this.minSpeed = undefined;
    this.maxSpeed = undefined;
    this.searchControl.setValue('');
    this.emitFilters();
  }

  emitFilters() {
    this.filtersChange.emit({
      search: this.searchText,
      type: this.selectedType,
      legendary: this.legendaryOnly,
      minSpeed: this.minSpeed,
      maxSpeed: this.maxSpeed,
    });
  }
}
