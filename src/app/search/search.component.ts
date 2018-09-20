import { ChangeDetectorRef, Component, NgZone, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take, tap } from 'rxjs/operators';
import { Poses, PosesService } from '../poses.service';
import { SearchResultComponent } from './search-result/search-result.component';

@Component({
  selector: 'yf-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  readonly searchControl: FormControl;
  readonly search$: Observable<SearchResults>;

  selectedIndex = 0;
  private resultCount = 0;

  @ViewChildren(SearchResultComponent)
  private resultElements!: QueryList<SearchResultComponent>;

  private readonly focusSubject = new Subject<boolean>();
  readonly isFocused$ = this.focusSubject.asObservable();

  constructor(
    private posesService: PosesService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    this.searchControl = this.formBuilder.control('');
    this.search$ = this.searchControl.valueChanges.pipe(
      map(s => s.trim()),
      distinctUntilChanged(),
      tap(() => (this.selectedIndex = 0)),
      mergeMap(query => {
        return this.posesService.search(query).pipe(
          map(results => {
            return { query, results: results.slice(0, 6) };
          }),
          tap(({ results }) => (this.resultCount = results.length)),
        );
      }),
    );
  }

  focus(): void {
    this.focusSubject.next(true);
  }

  blur(): void {
    this.focusSubject.next(false);
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.searchControl.setValue('');
    });
  }

  navigateResults(event: KeyboardEvent): void {
    let isChangeDetectionRequired = true;
    switch (event.keyCode) {
      case 40:
        this.selectedIndex = (this.selectedIndex + 1) % this.resultCount;
        break;
      case 38:
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.resultCount - 1;
        } else {
          this.selectedIndex -= 1;
        }
        break;
      case 27:
        this.searchControl.setValue('');
        setTimeout(() => this.blur());
        break;
      case 13:
        const resultElement = this.resultElements.find((_, index) => index === this.selectedIndex);
        if (resultElement) {
          resultElement.gotoResult();
          this.searchControl.setValue('');
          setTimeout(() => this.blur());
        }
        break;
      default:
        isChangeDetectionRequired = false;
    }

    if (isChangeDetectionRequired) {
      this.changeDetectorRef.detectChanges();
    }
  }
}

interface SearchResults {
  query: string;
  results: Poses;
}
