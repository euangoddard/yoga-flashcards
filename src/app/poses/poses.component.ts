import { Pose } from './../poses.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, fromEvent, ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroy } from 'take-until-destroy';
import { Poses } from '../poses.service';

@Component({
  selector: 'yf-poses',
  templateUrl: './poses.component.html',
})
export class PosesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('poses')
  allPoses!: Poses;
  @Input()
  pose!: Pose;

  private readonly element: HTMLElement;

  isDragging = false;
  private offsetX = 0;
  private lastPointerX = 0;
  private queuedOffsets: number[] = [];

  private readonly activePosesSubject = new ReplaySubject<Poses>(1);
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
    if (this.allPoses && this.allPoses.length && this.pose) {
      this.updateActivePoses();
    }
  }
  ngOnDestroy(): void {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  startDrag(event: TouchEvent | MouseEvent) {
    this.queuedOffsets = [];
    event.preventDefault();
    this.lastPointerX = getXFromEvent(event);
    this.isDragging = true;
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  @HostListener('touchleave')
  stopDrag() {
    this.isDragging = false;
    this.lastPointerX = 0;
    this.changeDetectorRef.detectChanges();
    this.snapToPose();
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  drag(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    const pageX = getXFromEvent(event);
    const deltaX = pageX - this.lastPointerX;
    this.lastPointerX = pageX;
    this.updateOffset(deltaX);
  }

  get transform(): string {
    return `translate3d(${this.offsetX}px, 0, 0)`;
  }

  private updateActivePoses(): void {
    const index = this.allPoses.findIndex(p => p.id === this.pose.id);
    // TODO: Consider end cases
    this.activePosesSubject.next([
      this.allPoses[index - 1],
      this.allPoses[index],
      this.allPoses[index + 1],
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

  private snapToPose() {
    const width = this.widthSubject.getValue();
    const snapToOffset = width * Math.round(this.offsetX / width);

    const pointCount = 20;
    const stepX = snapToOffset - this.offsetX;
    const queuedOffsets = [];
    for (let i = 0; i < pointCount; i++) {
      const t = i / pointCount;
      queuedOffsets.push(snapToOffset - Math.round(t ** 3 * stepX));
    }
    this.queuedOffsets = queuedOffsets;
    requestAnimationFrame(this.animateToSnappedPose.bind(this));
  }

  private animateToSnappedPose(): void {
    const point = this.queuedOffsets.pop();
    if (this.queuedOffsets.length) {
      requestAnimationFrame(this.animateToSnappedPose.bind(this));
    }
    if (typeof point === 'undefined') {
      return;
    }
    this.offsetX = point;
    this.changeDetectorRef.detectChanges();
  }
}

function getXFromEvent(event: TouchEvent | MouseEvent): number {
  if (event instanceof TouchEvent) {
    return event.touches[0].pageX;
  } else {
    return event.pageX;
  }
}
