import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';


export const routerConfig: Routes = [
  {
    path: '',
    redirectTo: '/calendar',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    component: AppComponent
  },
  {
    path: 'patient',
    component: PatientRecordComponent
  },
  {
    path: 'search',
    component: PatientSearchComponent
  }
];
