import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'yoga-flashcards',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
