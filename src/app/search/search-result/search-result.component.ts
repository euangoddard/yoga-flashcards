import { Component, ChangeDetectionStrategy, Input, HostListener } from '@angular/core';
import { Pose } from '../../poses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'yf-search-result',
  templateUrl: './search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  @Input()
  result!: Pose;

  constructor(private router: Router) {}

  @HostListener('click')
  gotoResult(): void {
    this.router.navigate(['/poses', this.result.id]);
  }
}
