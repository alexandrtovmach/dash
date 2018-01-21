import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class Country {
  constructor(public nameEnglish: string, public nameArabic: string) { }
}

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  nameEnglishControl = new FormControl('', [Validators.required]);
  nameArabicControl = new FormControl('', [Validators.required]);
  mobileControl = new FormControl('', [Validators.required]);
  addressControl = new FormControl('', [Validators.required]);
  nationalityControl = new FormControl('', [Validators.required]);
  nationalIdControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  countryCtrl: FormControl;
  filteredCountries: Observable<any[]>;

  countries: Country[] = [
    {
      nameEnglish: 'Egypt',
      nameArabic: 'مصر'
    },
    {
      nameEnglish: 'Saudi Arabia',
      nameArabic: 'السعوديه'
    },
    {
      nameEnglish: 'UAE',
      nameArabic: 'الامارات'
    }
  ];

  constructor() {
    this.countryCtrl = new FormControl();
    this.filteredCountries = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this.filterCountries(country) : this.countries.slice())
      );
  }

  filterCountries(name: string) {
    return this.countries.filter(country => country.nameEnglish.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

}
