import { Poses } from './../poses.service';
import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PosesControlsComponent } from './poses-controls/poses-controls.component';
import { ComponentFactoryResolver } from '@angular/core';

@Directive({
  selector: '[yfPoses]',
})
export class PosesDirective implements OnChanges {
  private poses: Poses = [];
  private index = 0;

  private controlRef = null;

  @Input()
  set yfPoses(poses: Poses) {
    this.poses = poses;
  }

  @Input()
  set yfPosesIndex(index: number) {
    this.index = index;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.poses &&
      this.poses.length &&
      typeof this.index !== undefined &&
      this.index !== null
    ) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        PosesControlsComponent,
      );
      const componentRef = this.viewContainerRef.createComponent(
        componentFactory,
      );
      const component = componentRef.instance;
      component.poses = this.poses;
      component.index = this.index;
      component.poseTemplate = this.templateRef;
    }
  }
}
