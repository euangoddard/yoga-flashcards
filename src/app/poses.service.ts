import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PosesService {
  constructor(private http: HttpClient) {}

  all(): Observable<ReadonlyArray<Pose>> {
    return this.http.get<Pose[]>('/assets/poses.json');
  }
}

export interface Pose {
  name: string;
  sanskrit?: string;
  imageUrl: string;
}
