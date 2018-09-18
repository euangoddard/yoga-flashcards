import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { Poses, PosesService } from '../poses.service';

@Component({
  selector: 'yf-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  readonly searchControl: FormControl;
  readonly search$: Observable<SearchResults>;

  private readonly focusSubject = new Subject<boolean>();
  readonly isFocused$ = this.focusSubject.asObservable();

  private selectedIndex: number | null = null;
  readonly selectedIndex$!: Observable<number | null>;

  private readonly keyCodeSubject = new Subject<number>();

  constructor(private posesService: PosesService, private formBuilder: FormBuilder) {
    this.searchControl = this.formBuilder.control('');
    this.search$ = this.searchControl.valueChanges.pipe(
      map(s => s.trim()),
      debounceTime(100),
      distinctUntilChanged(),
      mergeMap(query => {
        return this.posesService.search(query).pipe(
          map(results => {
            return { query, results: results.slice(0, 6) };
          }),
        );
      }),
    );

    this.selectedIndex$ = combineLatest(this.search$, this.keyCodeSubject.asObservable()).pipe(
      map(([search, keyCode]) => this.updateSelection(search, keyCode)),
    );
  }

  search(query: string): void {
    this.posesService.search(query);
  }

  focus(): void {
    this.focusSubject.next(true);
  }

  blur(): void {
    this.focusSubject.next(false);
  }

  navigateResults(event: KeyboardEvent): void {
    this.keyCodeSubject.next(event.keyCode);
    const keyCode = event.keyCode;
    switch (event.keyCode) {
      case 40:
        console.log('arrow down');
        break;
      case 38:
        console.log('arrow up');
        break;
      case 27:
        console.log('escape');
        break;
      case 13:
        console.log('enter');
        break;
    }
  }

  updateSelection(results: SearchResults, keyCode: number): number | null {
    console.log(results);
    console.log(keyCode);
    return null;
  }
}

interface SearchResults {
  query: string;
  results: Poses;
}
