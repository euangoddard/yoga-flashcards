import { Route } from '@angular/router';
import { GlossaryComponent } from 'src/app/glossary/glossary.component';
import { PoseRedirectComponent } from 'src/app/pose-redirect/pose-redirect.component';
import { BrowseComponent } from './browse/browse.component';
import { BrowseResolver } from './browse/browse.resolver';
import { HomeComponent } from './home/home.component';

export const ROUTES: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'poses',
    children: [
      { path: '', component: PoseRedirectComponent },
      {
        path: ':poseId',
        component: BrowseComponent,
        resolve: {
          pose: BrowseResolver,
        },
      },
    ],
  },
  { path: 'glossary', component: GlossaryComponent },
];
