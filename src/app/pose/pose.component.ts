import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pose } from 'src/app/poses.service';

@Component({
  selector: 'yf-pose',
  templateUrl: './pose.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoseComponent {
  @Input() pose!: Pose;
}
