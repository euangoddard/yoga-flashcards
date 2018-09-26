import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { BrowseComponent } from './browse/browse.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { HomeComponent } from './home/home.component';
import { PoseRedirectComponent } from './pose-redirect/pose-redirect.component';
import { PoseComponent } from './pose/pose.component';
import { PosesComponent } from './poses/poses.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    PoseComponent,
    PosesComponent,
    BrowseComponent,
    HomeComponent,
    SearchResultComponent,
    PoseRedirectComponent,
    GlossaryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
