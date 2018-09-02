import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PosesService, Pose } from './poses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'yoga-flashcards',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly poses$: Observable<ReadonlyArray<Pose>>;

  constructor(private posesService: PosesService) {
    this.poses$ = this.posesService.all();
  }
}
