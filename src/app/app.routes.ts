import { BrowseResolver } from './browse/browse.resolver';
import { BrowseComponent } from './browse/browse.component';
import { HomeComponent } from './home/home.component';
import { Route } from '@angular/router';

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
