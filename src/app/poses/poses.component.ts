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
} from '@angular/core';
import { Poses, Pose } from '../poses.service';
import { Subject, fromEvent } from 'rxjs';
import { takeUntilDestroy } from 'take-until-destroy';

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

  private readonly activePosesSubject = new Subject<Poses>();
  readonly activePoses$ = this.activePosesSubject.asObservable();

  private readonly widthSubject = new Subject<number>();
  readonly width$ = this.widthSubject.asObservable();

  constructor(private changeDetectorRef: ChangeDetectorRef, element: ElementRef) {
    this.element = element.nativeElement;
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

  private updateActivePoses(): void {
    // TODO: Consider end cases
    this.activePosesSubject.next([
      this.allPoses[this.index - 1],
      this.allPoses[this.index],
      this.allPoses[this.index + 1],
    ]);
  }

  private updateWidth(): void {
    this.widthSubject.next(this.element.getBoundingClientRect().width);
    this.changeDetectorRef.detectChanges();
  }
}
