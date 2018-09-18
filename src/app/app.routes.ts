import { Route } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { BrowseResolver } from './browse/browse.resolver';
import { HomeComponent } from './home/home.component';

export const ROUTES: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'poses/:poseId',
    component: BrowseComponent,
    resolve: {
      pose: BrowseResolver,
    },
  },
];
