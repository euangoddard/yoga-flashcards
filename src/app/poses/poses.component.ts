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
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroy } from 'take-until-destroy';
import { Poses } from '../poses.service';

@Component({
  selector: 'yf-poses',
  templateUrl: './poses.component.html',
})
export class PosesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('poses') allPoses!: Poses;
  @Input() index!: number;

  private readonly element: HTMLElement;

  isDragging = false;
  private offsetX = 0;
  private lastPointerX = 0;
  private queuedOffsets: number[] = [];

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
      .pipe(debounceTime(250), takeUntilDestroy(this))
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

  private snapToPose() {
    const width = this.widthSubject.getValue();
    const snapToOffset = width * Math.round(this.offsetX / width);

    const pointCount = 15;
    const stepX = (snapToOffset - this.offsetX) / pointCount;
    const queuedOffsets = [];
    for (let i = 0; i < pointCount; ++i) {
      queuedOffsets.push(snapToOffset - Math.round(i * stepX));
    }
    this.queuedOffsets = queuedOffsets;
    console.log(this.queuedOffsets);
    requestAnimationFrame(this.animateToSnappedPose.bind(this));
  }

  private animateToSnappedPose(): void {
    const point = this.queuedOffsets.pop()!;
    if (this.queuedOffsets.length) {
      requestAnimationFrame(this.animateToSnappedPose.bind(this));
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
