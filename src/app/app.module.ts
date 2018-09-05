import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { PoseComponent } from './pose/pose.component';
import { PosesControlsComponent } from './poses/poses-controls/poses-controls.component';
import { PosesDirective } from './poses/poses.directive';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    PoseComponent,
    PosesControlsComponent,
    PosesDirective,
  ],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  entryComponents: [PosesControlsComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
