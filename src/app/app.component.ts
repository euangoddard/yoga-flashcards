import { Component, OnInit } from '@angular/core';
import { PosesService, Pose } from './poses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'yoga-flashcards',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  poses$: Observable<ReadonlyArray<Pose>>;

  constructor(private posesService: PosesService) {}

  ngOnInit(): void {
    this.poses$ = this.posesService.all();
  }
}
