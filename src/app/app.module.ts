import { ROUTES } from './app.routes';
import { PosesComponent } from './poses/poses.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormControlDirective } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { PoseComponent } from './pose/pose.component';
import { BrowseComponent } from './browse/browse.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    PoseComponent,
    PosesComponent,
    BrowseComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, RouterModule.forRoot(ROUTES)],
  bootstrap: [AppComponent],
})
export class AppModule {}
