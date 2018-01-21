import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';


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
  }
];
