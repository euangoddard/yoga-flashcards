import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { BrowseComponent } from './browse/browse.component';
import { HomeComponent } from './home/home.component';
import { PoseComponent } from './pose/pose.component';
import { PosesComponent } from './poses/poses.component';
import { SearchComponent } from './search/search.component';

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
