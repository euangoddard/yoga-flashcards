import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { PosesService } from 'src/app/poses.service';

@Component({
  selector: 'yf-pose-redirect',
  template: '',
})
export class PoseRedirectComponent implements OnInit {
  constructor(private posesService: PosesService, private router: Router) {}

  ngOnInit() {
    this.posesService
      .all()
      .pipe(
        map(poses => poses[0]),
        take(1),
      )
      .subscribe(pose => this.router.navigate(['/poses', pose.id]));
  }
}
