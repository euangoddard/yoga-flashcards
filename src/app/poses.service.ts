import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as lunr from 'lunr';
import { Index, QueryParseError } from 'lunr';

@Injectable({
  providedIn: 'root',
})
export class PosesService {
  private idx!: Index;
  private posesSubject = new ReplaySubject<Poses>(1);
  private poseByIdSubject = new ReplaySubject<PoseById>(1);
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.loadData();

    const poses$ = this.all()
      .pipe(take(1))
      .subscribe(poses => {
        this.idx = lunr(function() {
          this.field('name');
          this.field('sanskrit');

          poses.forEach((pose, index) => {
            this.add({ ...pose, id: index });
          });
        });
      });
  }

  all(): Observable<Poses> {
    return this.posesSubject.asObservable();
  }

  search(query: string): Observable<Poses> {
    const startsWithQuery = query.split(' ', 1)[0] + '*';
    let results: Index.Result[] = [];
    try {
      results = this.idx.search(`${query} ${startsWithQuery}`);
    } catch (error) {
      if (error instanceof QueryParseError) {
        results = [];
      } else {
        throw error;
      }
    }

    return this.poseByIdSubject.pipe(
      map(poseById => {
        return results.map(result => {
          return poseById[result.ref];
        });
      }),
    );
  }

  private loadData(): void {
    this.http
      .get<Pose[]>('/assets/poses.json')
      .pipe(take(1))
      .subscribe(poses => {
        this.posesSubject.next(poses);
        const poseById: PoseById = {};
        poses.forEach((pose, index) => {
          poseById[`${index}`] = pose;
        });
        this.poseByIdSubject.next(poseById);
      });
  }
}

export interface Pose {
  name: string;
  sanskrit?: string;
  imageUrl: string;
}

export type Poses = ReadonlyArray<Pose>;

interface PoseById {
  [id: string]: Pose;
}
