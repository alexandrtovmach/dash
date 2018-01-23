import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatProgressBarModule,
    MatExpansionModule
} from '@angular/material';
import 'hammerjs';

import 'flatpickr/dist/flatpickr.css';
import * as flatpickr from 'flatpickr';
import { FlatpickrModule, FLATPICKR } from 'angularx-flatpickr';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { NgUploaderModule } from 'ngx-uploader';

import { AppComponent } from './app.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { CalendarComponent } from './calendar/calendar.component';
import { routerConfig } from './router-config';

export function flatpickrFactory() {
  return flatpickr;
}

@NgModule({
  declarations: [
    AppComponent,
    PatientRecordComponent,
    PatientSearchComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routerConfig),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FlatpickrModule.forRoot({
      provide: FLATPICKR,
      useFactory: flatpickrFactory
    }),
    NvD3Module,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatProgressBarModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    NgUploaderModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
