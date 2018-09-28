import { Component } from '@angular/core';
import { PosesService } from 'src/app/poses.service';

@Component({
  selector: 'yf-poses-list',
  templateUrl: './poses-list.component.html',
})
export class PosesListComponent {
  readonly poses$ = this.posesService.all();

  constructor(private posesService: PosesService) {}
}
