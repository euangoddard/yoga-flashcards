import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PosesService, Pose } from './poses.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'yoga-flashcards',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly poses$: Observable<ReadonlyArray<Pose>>;
  readonly searchControl: FormControl;

  constructor(
    private posesService: PosesService,
    private formBuilder: FormBuilder,
  ) {
    this.poses$ = this.posesService.all();
    this.searchControl = this.formBuilder.control('');
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap(query => this.posesService.search(query)),
      )
      .subscribe(results => {
        console.log(results);
      });
  }

  search(query: string): void {
    this.posesService.search(query);
  }
}
