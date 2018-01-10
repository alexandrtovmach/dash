import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('daysContainer') daysContainer: ElementRef;
  inlineDatePicker;
  doctorCtrl: FormControl;
  filteredDoctors: Observable<any[]>;
  show = false;
  baseDay = new Date(new Date().toDateString()).valueOf();
  days = [];
  position = 0;
  diff = 0;

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
  }

  ngOnInit() {
    this.show = true;
    
    this.timesGenerator();
    this.daysGenerator(this.baseDay);
    this.focusOnDate(this.baseDay)
  }

  timesGenerator() {
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

  daysGenerator(base?) {
    this.days = [];
    for (let i = -15; i < 15; i++) {
      this.days.push(base + i*24*60*60*1000)
    }
  }

  focusOnDate(date) {
    this.position = this.days.indexOf(date);
    if (this.position > -1) {
      this.daysContainer.nativeElement.style.transform = `translateX(-${(200 * this.position) + this.position}px)`;
      if (this.position > this.days.length - 5 || this.position < 5) {
        setTimeout(() => {
          this.daysContainer.nativeElement.style.transition = '0s';
          setTimeout(() => {
            this.daysContainer.nativeElement.style.transition = null;
          }, 0)
          this.daysGenerator(this.days[this.position]);
          this.focusOnDate(date);
        }, 1000)
      }
    } else {
      this.daysContainer.nativeElement.style.transition = 'opacity 1s 0s, transform 0s 1s';
      this.daysContainer.nativeElement.style.opacity = '0';
      setTimeout(() => {
        this.daysContainer.nativeElement.style.transition = null;
        this.daysContainer.nativeElement.style.opacity = null;
        this.daysGenerator(date);
        this.focusOnDate(date);
      }, 1000)
    }
  }
  filterDoctors(name) {
    return this.doctors.filter(doctor => doctor.nameEnglish.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  pickDoctor() {
    console.log(this.doctorCtrl.value)
  }

  scrollCalendar(side) {
    this.diff += side;
    console.log(this.position - this.diff);
    this.daysContainer.nativeElement.style.transform = `translateX(${parseFloat(this.daysContainer.nativeElement.style.transform.split('(')[1]) + (201 * side)}px)`;
    if (this.position - this.diff > this.days.length - 5 || this.position - this.diff < 5) {
      this.focusOnDate(this.days[this.position - this.diff]);
      this.diff = 0;
    }
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