import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators/map';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

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
  options: UploaderOptions;
  formData: FormData;
  filesFirst: UploadFile[] = [];
  filesSecond: UploadFile[] = [];
  first: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  second: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  humanizeBytes: Function = humanizeBytes;
  dragOver: boolean;

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

  onUploadOutputFirst(output: UploadOutput): void {
    if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.filesFirst.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.filesFirst.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesFirst[index] = output.file;
    } else if (output.type === 'removed') {
      this.filesFirst = this.filesFirst.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  onUploadOutputSecond(output: UploadOutput): void {
    if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      this.filesSecond.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.filesSecond.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.filesSecond[index] = output.file;
    } else if (output.type === 'removed') {
      this.filesSecond = this.filesSecond.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  startUploadFirst(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: '/api/patient/uploadFile',
      method: 'POST',
      file: this.filesFirst[0]
    };
    this.first.emit(event);
    console.log(this.filesSecond);
  }

  startUploadSecond(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: '/api/patient/uploadFile',
      method: 'POST',
      file: this.filesSecond[0]
    };
    this.first.emit(event)
  }

  // cancelUpload(id: string): void {
  //   this.uploadInput.emit({ type: 'cancel', id: id });
  // }

  // removeFile(id: string): void {
  //   this.uploadInput.emit({ type: 'remove', id: id });
  // }

  // removeAllFiles(): void {
  //   this.uploadInput.emit({ type: 'removeAll' });
  // }
}

// https://8dfu8j4cih.execute-api.ap-southeast-1.amazonaws.com/dev/patientRecord/create