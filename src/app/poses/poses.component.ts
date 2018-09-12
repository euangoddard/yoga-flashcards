import { debounceTime, startWith } from 'rxjs/operators';
import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { Poses, Pose } from '../poses.service';
import { Subject, fromEvent, BehaviorSubject } from 'rxjs';
import { takeUntilDestroy } from 'take-until-destroy';

const FRICTION = 0.95;
const STOP_THRESHOLD = 0.3;

@Component({
  selector: 'yf-poses',
  templateUrl: './poses.component.html',
})
export class PosesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('poses')
  allPoses!: Poses;
  @Input()
  index!: number;

  private readonly element: HTMLElement;

  isDragging = false;
  private offsetX = 0;
  private lastPointerX = 0;
  private animationId = -1;
  private trackingPoints: ReadonlyArray<TrackingPoint> = [];
  private isDecelerating = false;
  private decVelX = 0;

  private readonly activePosesSubject = new Subject<Poses>();
  readonly activePoses$ = this.activePosesSubject.asObservable();

  private readonly widthSubject = new BehaviorSubject<number>(0);
  readonly width$ = this.widthSubject.asObservable();

  constructor(private changeDetectorRef: ChangeDetectorRef, element: ElementRef) {
    this.element = element.nativeElement;
    this.changeDetectorRef.detach();
  }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        takeUntilDestroy(this),
      )
      .subscribe(() => this.updateWidth());
  }

  ngAfterViewInit(): void {
    this.updateWidth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.allPoses &&
      this.allPoses.length &&
      typeof this.index !== undefined &&
      this.index !== null
    ) {
      this.updateActivePoses();
    }
  }
  ngOnDestroy(): void {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  startDrag(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    this.lastPointerX = getXFromEvent(event);
    this.isDragging = true;
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('touchleave', ['$event'])
  stopDrag(event: TouchEvent | MouseEvent) {
    const pageX = getXFromEvent(event);
    this.isDragging = false;
    this.lastPointerX = 0;
    this.changeDetectorRef.detectChanges();
    this.startDeceleration();
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  drag(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    const pageX = getXFromEvent(event);

    this.addTrackingPoint(pageX);
    const deltaX = pageX - this.lastPointerX;
    this.lastPointerX = pageX;
    this.updateOffset(deltaX);
  }

  get transform(): string {
    return `translate3d(${this.offsetX}px, 0, 0)`;
  }

  private updateActivePoses(): void {
    // TODO: Consider end cases
    this.activePosesSubject.next([
      this.allPoses[this.index - 1],
      this.allPoses[this.index],
      this.allPoses[this.index + 1],
    ]);
    this.changeDetectorRef.detectChanges();
  }

  private updateWidth(): void {
    this.widthSubject.next(this.element.getBoundingClientRect().width);
    this.changeDetectorRef.detectChanges();
  }

  private updateOffset(deltaX: number) {
    this.offsetX += deltaX;
    const width = this.widthSubject.getValue();
    this.offsetX = Math.max(Math.min(width, this.offsetX), -1 * width);
    this.changeDetectorRef.detectChanges();
  }

  private addTrackingPoint(x: number) {
    const time = Date.now();
    const trackingPoints = [...this.trackingPoints];
    while (trackingPoints.length > 0) {
      if (time - trackingPoints[0].time <= 100) {
        break;
      }
      trackingPoints.shift();
    }
    trackingPoints.push({ x, time });
    this.trackingPoints = trackingPoints;
  }

  // Deceleration
  startDeceleration(): void {
    const firstPoint = this.trackingPoints[0];
    const lastPoint = this.trackingPoints[this.trackingPoints.length - 1];

    const xOffset = lastPoint.x - firstPoint.x;
    const timeOffset = lastPoint.time - firstPoint.time;

    const D = timeOffset / 15;

    this.decVelX = xOffset / D || 0; // prevent NaN

    if (Math.abs(this.decVelX) > 1) {
      this.isDecelerating = true;
      requestAnimationFrame(this.stepDeceleration.bind(this));
    } else {
      this.isDecelerating = false;
    }
  }

  stepDeceleration() {
    if (!this.isDecelerating) {
      return;
    }

    const decVelX = this.decVelX * FRICTION;
    if (Math.abs(decVelX) > STOP_THRESHOLD) {
      this.updateOffset(decVelX);
      requestAnimationFrame(this.stepDeceleration.bind(this));
      this.decVelX = decVelX;
    } else {
      this.isDecelerating = false;
    }
  }
}

function getXFromEvent(event: TouchEvent | MouseEvent): number {
  if (event instanceof TouchEvent) {
    return event.touches[0].pageX;
  } else {
    return event.pageX;
  }
}

interface TrackingPoint {
  time: number;
  x: number;
}
