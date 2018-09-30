import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'yoga-flashcards',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly isNewVersionAvailable$: Observable<boolean>;

  constructor(private updates: SwUpdate) {
    if (environment.production) {
      this.isNewVersionAvailable$ = this.updates.available.pipe(
        mapTo(true),
        startWith(false),
      );
    } else {
      this.isNewVersionAvailable$ = of(false);
    }
  }

  ngOnInit(): void {
    if (environment.production) {
      this.updates.checkForUpdate();
    }
  }

  reload(): void {
    document.location.reload();
  }
}
