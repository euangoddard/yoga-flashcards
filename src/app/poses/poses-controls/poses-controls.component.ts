import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Poses, Pose } from '../../poses.service';

@Component({
  selector: 'yf-poses-controls',
  templateUrl: './poses-controls.component.html',
})
export class PosesControlsComponent implements OnInit {
  @Input()
  poses!: Poses;
  @Input()
  index = 0;
  @Input()
  poseTemplate!: TemplateRef<any>;

  constructor() {}

  ngOnInit() {
    console.log(this.poseTemplate);
  }

  get leftPose(): Pose {
    return this.poses[this.index - 1];
  }

  get midPose(): Pose {
    return this.poses[this.index];
  }

  get rightPose(): Pose {
    return this.poses[this.index + 1];
  }
}
