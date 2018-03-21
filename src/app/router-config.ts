import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { OphthalmologyFundusViewComponent } from './fundus-view/ophthalmology-fundus-view.component';


export const routerConfig: Routes = [
  {
    path: '',
    redirectTo: '/calendar',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'patient',
    component: PatientRecordComponent
  },
  {
    path: 'ophtalmology',
    component: OphthalmologyFundusViewComponent
  },
  {
    path: 'search',
    component: PatientSearchComponent
  }
];
