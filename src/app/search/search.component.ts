import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { PosesService, Poses } from '../poses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'yf-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  readonly searchControl: FormControl;
  readonly search$: Observable<SearchResults>;

  constructor(private posesService: PosesService, private formBuilder: FormBuilder) {
    this.searchControl = this.formBuilder.control('');
    this.search$ = this.searchControl.valueChanges.pipe(
      map(s => s.trim()),
      debounceTime(100),
      distinctUntilChanged(),
      mergeMap(query => {
        return this.posesService.search(query).pipe(
          map(results => {
            return { query, results };
          }),
        );
      }),
    );
  }
  search(query: string): void {
    this.posesService.search(query);
  }
}

interface SearchResults {
  query: string;
  results: Poses;
}
