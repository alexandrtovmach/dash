import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './new-styles.scss']
})
export class AppComponent implements OnInit {
  inlineDatePicker;
  doctorCtrl: FormControl;
  filteredDoctors: Observable<any[]>;
  show = false;
  days = []

  doctors = [
    {
      nameEnglish: 'Dr. Ahmed Mohsen'
    },
    {
      nameEnglish: 'Dr. Mohamed Hassan'
    },
    {
      nameEnglish: 'Dr. Mohamed Nasr'
    }
  ];
  quarterHours = ['00', '15', '30', '45'];
  times = [];


  constructor() {
    this.doctorCtrl = new FormControl();
    this.filteredDoctors = this.doctorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(doctor => doctor ? this.filterDoctors(doctor) : this.doctors.slice())
      );

    for (let i = 8; i < 24; i++) {
      for (let j = 0; j < 4; j++) {
        let time = i + ':' + this.quarterHours[j];
        if (i < 10) {
          time = '0' + time;
        }
        this.times.push(time);
      }
    }
  }

  ngOnInit() {
    this.show = true;
    console.log(this.days)
  }


  filterDoctors(name) {
    return this.doctors.filter(doctor => doctor.nameEnglish.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  pickDoctor() {
    console.log(this.doctorCtrl.value)
  }
}

const fakedResponseObj = [
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Alex",
    date: "10/10/1995",
    from: new Date(2018, 0, 10, 9),
    to: new Date(2018, 0, 10, 12),
    status: "ussual",
    category: "regular medicine",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: ""
  },
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 12, 12),
    to: new Date(2018, 0, 12, 15),
    status: "ussual",
    category: "regular medicine",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: ""
  }
]