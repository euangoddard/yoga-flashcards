import { Observable } from 'rxjs';
import { PosesService, Pose, Poses } from './../poses.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'yf-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent {
  readonly poseOfDay$: Observable<Pose>;

  constructor(private posesService: PosesService) {
    this.poseOfDay$ = this.posesService.all().pipe(map(poses => this.findPoseOfTheDay(poses)));
  }

  private findPoseOfTheDay(poses: Poses): Pose {
    const dateInt = Math.floor(Date.now() / 1000 / 3600);
    const poseIndex = dateInt % poses.length;
    return poses[poseIndex];
  }
}
