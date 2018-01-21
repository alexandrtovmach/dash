import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators/map';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

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
  styleUrls: ['./patient-record.component.scss']
})

export class PatientRecordComponent implements OnInit {
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
  files: {
    fisrt: UploadFile[],
    second: UploadFile[]
  } | {} = {};

  constructor(private http: Http) {}

  ngOnInit() {
    this.countryCtrl = new FormControl();
    this.filteredCountries = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this.filterCountries(country) : this.countries.slice())
      );
  }

  filterCountries(name) {
    return this.countries.filter(country => country.nameEnglish.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  
  
  dropped(event: UploadEvent, field: 'first' | 'second') {
    this.files[field] = event.files;
    console.log(this.files[field]);
  }

  savePatient(patientForm) {
    // if (
    //   this.nameEnglishControl.valid &&
    //   this.nameArabicControl.valid &&
    //   this.mobileControl.valid &&
    //   this.nationalIdControl.valid &&
    //   this.addressControl.valid &&
    //   this.nationalityControl.valid &&
    //   this.files['first'] && this.files['first'].length &&
    //   this.files['second'] && this.files['second'].length
    // ) {
      this.sendFile(this.files)
      const patient = {
        nameEnglish: this.nameEnglishControl.value,
        nameArabic: this.nameArabicControl.value,
        mobile: this.mobileControl.value,
        phone: '',
        birthday: '',
        occupation: '',
        nationalId: this.nationalIdControl.value,
        address: this.addressControl.value,
        nationality: this.nationalityControl.value,
        referral: '',
        status: '',
        category: '',
        charity: ''
      }
    // } else {
    //   return false;
    // }
  }

  sendFile(files) {
    console.log(files, 'sending')
    this.http.post('/api/menu/uploadFile', files['first'][0], {headers: new Headers({'Content-Type': 'multipart/form-data'})}).toPromise()
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.error(err)
      })
  }
}

// https://8dfu8j4cih.execute-api.ap-southeast-1.amazonaws.com/dev/patientRecord/create