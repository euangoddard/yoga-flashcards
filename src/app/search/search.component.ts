import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  startWith,
} from 'rxjs/operators';
import { PosesService, Poses } from '../poses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'yf-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  readonly searchControl: FormControl;
  readonly results$: Observable<Poses>;
  readonly noResults$: Observable<boolean>;

  constructor(
    private posesService: PosesService,
    private formBuilder: FormBuilder,
  ) {
    this.searchControl = this.formBuilder.control('');
    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      mergeMap(query => this.posesService.search(query)),
      startWith([]),
    );
    this.noResults$ = this.results$.pipe(map(r => !r.length));
  }
  search(query: string): void {
    this.posesService.search(query);
  }
}
