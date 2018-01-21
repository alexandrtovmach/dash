import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './new-styles.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('daysContainer') daysContainer: ElementRef;
  inlineDatePicker;
  doctorCtrl: FormControl;
  filteredDoctors: Observable<any[]>;
  show = false;
  baseDay = new Date(new Date().toDateString()).valueOf();
  days = [];
  position = 0;
  diff = 0;
  filteredEvents = [];

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
    this.filteredEvents = fakedResponseObj;
    
    this.timesGenerator();
    this.daysGenerator(this.baseDay);
    this.eventsGenerator(fakedResponseObj);
    this.focusOnDate(this.baseDay);
  }

  ngAfterViewInit() {
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
      this.days.push({
        dateMs: (base + i*24*60*60*1000),
        events: []
      });
    }
  }

  eventsGenerator(events, filterBy?) {
    if (filterBy) {
      this.daysGenerator(this.baseDay);
      if (filterBy.off) {
        this.filteredEvents.push(...events.filter(el => {
          return el[filterBy.name] !== filterBy.value
        }))
      } else {
        this.filteredEvents = this.filteredEvents.filter(el => {
          if (filterBy.all) {
            for (let key in el) {
              try {
                if (el[key].toString().toLowerCase().includes(filterBy.value.toLowerCase())) {
                  return true;
                }
              } catch(err) {
                console.error(err);
              }
            }
          }
          return el[filterBy.name] === filterBy.value
        })
      }
      this.eventsGenerator(this.filteredEvents);
    } else {
      events.forEach(el => {
        const from = el.from.valueOf(), to = el.to.valueOf();
        if (from >= this.days[0].dateMs && to <= this.days[this.days.length - 1].dateMs) {
          let date = new Date(new Date(from).toDateString()).valueOf(),
              fromHours = new Date(from).getHours(),
              fromMinutes = Math.round(new Date(from).getMinutes()/15)*15,
              toHours = new Date(to).getHours(),
              toMinutes = Math.round(new Date(to).getMinutes()/15)*15;
          if (fromMinutes === 60) {
            fromHours++;
            fromMinutes = 0;
          }
          if (toMinutes === 60) {
            toHours++;
            toMinutes = 0;
          }
          const fromTime = `${fromHours < 10? '0'+fromHours: fromHours}:${fromMinutes < 10? '0'+fromMinutes: fromMinutes}`;
          const toTime = `${toHours < 10? '0'+toHours: toHours}:${toMinutes < 10? '0'+toMinutes: toMinutes}`;
          this.days = this.days.map(elem => {
            if (elem.dateMs === date) {
              elem.events[this.times.indexOf(fromTime)] = el;
              let i = this.times.indexOf(fromTime) + 1;      
              while (this.times[i] !== toTime) {
                elem.events[i] = 'fill';
                i++;
              }
            }
            return elem
          })
        }
      });
    }
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
    this.eventsGenerator(fakedResponseObj, {name: 'doctor', value: this.doctorCtrl.value})
  }

  filterChecked(checked, name) {
    if (checked) {
      this.eventsGenerator(fakedResponseObj, {name: 'category', value: name});
    } else {
      this.eventsGenerator(fakedResponseObj, {name: 'category', value: name, off: true});
    }
  }

  scrollCalendar(side) {
    this.diff += side;
    this.daysContainer.nativeElement.style.transform = `translateX(${parseFloat(this.daysContainer.nativeElement.style.transform.split('(')[1]) + (201 * side)}px)`;
    if (this.position - this.diff > this.days.length - 5 || this.position - this.diff < 5) {
      this.focusOnDate(this.days[this.position - this.diff].dateMs);
      this.diff = 0;
    }
  }

  search(val) {
    this.eventsGenerator(fakedResponseObj, {all: true, value: val})
  }
  
}

const fakedResponseObj = [
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Alex",
    date: "10/10/1995",
    from: new Date(2018, 0, 19, 9),
    to: new Date(2018, 0, 19, 12),
    status: "ussual",
    category: "new",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He is requesting an report"
  },
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Alex",
    date: "10/10/1995",
    from: new Date(2018, 0, 18, 13),
    to: new Date(2018, 0, 18, 15),
    status: "ussual",
    category: "new",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He is requesting an report"
  },
  {
    doctor: "Dr. Mohamed Nasr",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 19, 13),
    to: new Date(2018, 0, 19, 15),
    status: "ussual",
    category: "wait list",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He want to quick review"
  },
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 18, 18, 30),
    to: new Date(2018, 0, 18, 19),
    status: "ussual",
    category: "wait list",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He want to quick review"
  },
  {
    doctor: "Dr. Mohamed Nasr",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 19, 17),
    to: new Date(2018, 0, 19, 19),
    status: "ussual",
    category: "followup",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He want to quick review"
  },
  {
    doctor: "Dr. Mohamed Nasr",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 20, 12),
    to: new Date(2018, 0, 20, 15),
    status: "ussual",
    category: "followup",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He want to quick review"
  },
  {
    doctor: "Dr. Ahmed Mohsen",
    service: "Cardio",
    patientRecord: "Mira",
    date: "3/5/2001",
    from: new Date(2018, 0, 21, 12),
    to: new Date(2018, 0, 21, 15),
    status: "ussual",
    category: "followup",
    createdBy: "assistant",
    createdAt: new Date(2017, 11, 10),
    notes: "He want to quick review"
  }
]