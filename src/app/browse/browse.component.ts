import { pluck } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Poses, PosesService } from './../poses.service';
import { Pose } from './../poses.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'yf-browse',
  templateUrl: './browse.component.html',
  styles: [],
})
export class BrowseComponent implements OnInit {
  readonly poses$: Observable<ReadonlyArray<Pose>>;
  pose$!: Observable<Pose>;

  constructor(
    private posesService: PosesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.poses$ = this.posesService.all();
  }

  ngOnInit(): void {
    this.pose$ = this.route.data.pipe(pluck('pose'));
  }

  navigateToPose(pose: Pose): void {
    this.router.navigate(['/poses', pose.id]);
  }
}
