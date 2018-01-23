import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss']
})

export class PatientSearchComponent implements OnInit {
  patients: any;
  modelChanged: Subject<string> = new Subject<string>();

  constructor(private http: Http) {
      this.modelChanged
          .debounceTime(1000)
          .distinctUntilChanged()
          .subscribe(model => this.sendReq(model));
  }

  ngOnInit() {}

  changed(text: string) {
      this.modelChanged.next(text);
  }

  sendReq(textSearch) {
    this.http.get(`/api/patient/search/${textSearch}`, {headers: new Headers({'Content-Type': 'multipart/form-data'})}).toPromise()
      .then(data => {
        console.log(JSON.parse(data['_body']));
        this.patients = JSON.parse(data['_body']);
      })
      .catch(err => {
        console.error(err)
      })
  }
}