import { Route } from '@angular/router';
import { GlossaryComponent } from 'src/app/glossary/glossary.component';
import { PosesListComponent } from 'src/app/poses-list/poses-list.component';
import { BrowseComponent } from './browse/browse.component';
import { BrowseResolver } from './browse/browse.resolver';
import { HomeComponent } from './home/home.component';

export const ROUTES: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'poses',
    children: [
      { path: '', component: PosesListComponent },
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
