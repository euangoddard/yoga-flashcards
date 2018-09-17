import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pose, PosesService } from './../poses.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BrowseResolver implements Resolve<Pose | null> {
  constructor(private posesService: PosesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pose | null> {
    const poseId = route.params.poseId;

    return this.posesService.all().pipe(
      take(1),
      map(poses => {
        return poses.find(pose => pose.id === poseId) || null;
      }),
      tap(pose => {
        if (!pose) {
          this.router.navigate(['/']);
        }
      }),
    );
  }
}
