import { Component, ViewEncapsulation, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
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
export class AppComponent implements OnInit, AfterViewChecked {
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
    this.focusOnDate(this.baseDay);
  }

  ngAfterViewChecked() {
    this.eventsGenerator(fakedResponseObj)
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
      this.days.push({dateMs: (base + i*24*60*60*1000)});
    }
  }

  eventsGenerator(events) {
    events.forEach(el => {
      const from = el.from.valueOf(), to = el.to.valueOf();
      if (from >= this.days[0].dateMs && to <= this.days[this.days.length - 1].dateMs) {
        let date = new Date(new Date(from).toDateString()).valueOf(),
            hours = new Date(from).getHours(),
            minutes = Math.round(new Date(from).getMinutes()/15)*15;
        if (minutes === 60) {
          hours++;
          minutes = 0;
        }
        const time = `${hours < 10? '0'+hours: hours}:${minutes < 10? '0'+minutes: minutes}`;
        this.days.forEach(elem => {
          if (elem.date === date) {
            elem.events[0] = el
          }
        })
      }
    });
  }

  focusOnDate(date) {
    this.position = -1;
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].dateMs === date) {
        this.position = i;
        break;
      }
    }
    if (this.position > -1) {
      this.daysContainer.nativeElement.style.transform = `translateX(-${(200 * this.position) + this.position}px)`;
      if (this.position > this.days.length - 5 || this.position < 5) {
        setTimeout(() => {
          this.daysContainer.nativeElement.style.transition = '0s';
          setTimeout(() => {
            this.daysContainer.nativeElement.style.transition = null;
          }, 0)
          this.daysGenerator(this.days[this.position].dateMs);
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
      this.focusOnDate(this.days[this.position - this.diff].dateMs);
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
    from: new Date(2018, 0, 11, 9),
    to: new Date(2018, 0, 11, 12),
    status: "ussual",
    category: "regular medicine",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He is requesting an report"
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
    notes: "He want to quick review"
  }
]