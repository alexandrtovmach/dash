import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'calendar-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss', './new-styles.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('daysContainer') daysContainer: ElementRef;
  inlineDatePicker;
  isLoaded: boolean = false;
  responseObj: any;
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


  constructor(private http: Http) {
    this.doctorCtrl = new FormControl();
    this.filteredDoctors = this.doctorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(doctor => doctor ? this.filterDoctors(doctor) : this.doctors.slice())
      );
  }

  ngOnInit() {
    this.http
      .get(`https://xwd61qjfg4.execute-api.ap-southeast-1.amazonaws.com/dev/appointments/getByDoctor/5a913c83beb58e0001734f43`)
      .toPromise()
      .then(data => {
        this.isLoaded = true;
        this.show = true;
        this.responseObj =  JSON.parse(data['_body']).message;
        console.log(this.responseObj);
      })
      .then(() => {
        this.filteredEvents = this.responseObj;
        this.timesGenerator();
        this.daysGenerator(this.baseDay);
        this.eventsGenerator(this.responseObj);
        this.focusOnDate(this.baseDay);
      })
      .catch(err => {
        console.error(err)
      })
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
    this.eventsGenerator(this.responseObj, {name: 'doctor', value: this.doctorCtrl.value})
  }

  filterChecked(checked, name) {
    if (checked) {
      this.eventsGenerator(this.responseObj, {name: 'category', value: name});
    } else {
      this.eventsGenerator(this.responseObj, {name: 'category', value: name, off: true});
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
    this.eventsGenerator(this.responseObj, {all: true, value: val})
  }
  
}

//   {
//     doctor: "Dr. Ahmed Mohsen",
//     service: "Cardio",
//     patientRecord: "Alex",
//     date: "10/10/1995",
//     from: new Date(2018, 0, 18, 13),
//     to: new Date(2018, 0, 18, 15),
//     status: "ussual",
//     category: "new",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He is requesting an report"
//   },
//   {
//     doctor: "Dr. Mohamed Nasr",
//     service: "Cardio",
//     patientRecord: "Mira",
//     date: "3/5/2001",
//     from: new Date(2018, 0, 19, 13),
//     to: new Date(2018, 0, 19, 15),
//     status: "ussual",
//     category: "wait list",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He want to quick review"
//   },
//   {
//     doctor: "Dr. Ahmed Mohsen",
//     service: "Cardio",
//     patientRecord: "Mira",
//     date: "3/5/2001",
//     from: new Date(2018, 0, 18, 18, 30),
//     to: new Date(2018, 0, 18, 19),
//     status: "ussual",
//     category: "wait list",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He want to quick review"
//   },
//   {
//     doctor: "Dr. Mohamed Nasr",
//     service: "Cardio",
//     patientRecord: "Mira",
//     date: "3/5/2001",
//     from: new Date(2018, 0, 19, 17),
//     to: new Date(2018, 0, 19, 19),
//     status: "ussual",
//     category: "followup",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He want to quick review"
//   },
//   {
//     doctor: "Dr. Mohamed Nasr",
//     service: "Cardio",
//     patientRecord: "Mira",
//     date: "3/5/2001",
//     from: new Date(2018, 0, 20, 12),
//     to: new Date(2018, 0, 20, 15),
//     status: "ussual",
//     category: "followup",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He want to quick review"
//   },
//   {
//     doctor: "Dr. Ahmed Mohsen",
//     service: "Cardio",
//     patientRecord: "Mira",
//     date: "3/5/2001",
//     from: new Date(2018, 0, 21, 12),
//     to: new Date(2018, 0, 21, 15),
//     status: "ussual",
//     category: "followup",
//     createdBy: "assistant",
//     createdAt: new Date(2017, 11, 10),
//     notes: "He want to quick review"
//   }
// ]

// =====================================================================================================================================
// [  
  {  
     "status":"new",
     "createdAt":"2018-03-02T11:38:43.604Z",
     "deleted":false,
     "_id":"5a9937c338918600013ff4b5",
     "account":"5a7dc92a4cefed0b653f6e48",
     "branch":"5a9937c338918600013ff4b4",
     "doctor":{  
        "createdAt":"2018-02-24T10:20:51.916Z",
        "deleted":false,
        "_id":"5a913c83beb58e0001734f43",
        "account":"5a7dc92a4cefed0b653f6e48",
        "branch":"5a7e14d8cef9ad0001d8a915",
        "department":"5a868c739de0580001372f73",
        "username":"admin2253388",
        "password":"$2a$10$qIGNsCvPKkVcE3YsjQv9aeRxUh8z9q4lc61qpSrxB.pDZC93vSa6i",
        "nameEnglish":"Mohamed Nasr",
        "nameArabic":"Mohamed Nasr",
        "gender":"female",
        "mobile":567803080,
        "phone":567803080,
        "birthday":"1987-12-31T20:00:00.000Z",
        "email":"asdsad@asd.com",
        "nationalId":"97987897",
        "maritalStatus":"single",
        "address":"12213",
        "nationality":"United Arab Emirates",
        "role":"doctor",
        "joinDate":"1998-12-31T20:00:00.000Z",
        "contractType":"Full Time",
        "policy":"5a868c739de0580001372f73",
        "passportNumber":"A123123as",
        "passportIssueDate":"2018-02-19T20:00:00.000Z",
        "passportExpiryDate":"2018-02-27T20:00:00.000Z",
        "residency":"13123",
        "residencyIssueDate":"2018-02-04T20:00:00.000Z",
        "residencyExpiryDate":"2018-02-27T20:00:00.000Z",
        "labourCard":"1231313213",
        "labourCardExpiryDate":"2018-03-08T20:00:00.000Z",
        "rate":"200",
        "rateType":"Per Day",
        "rateOverTime":"400",
        "leaveDays":"30",
        "leaveType":"Calendar",
        "notes":"notees",
        "__v":0
     },
     "service":{  
        "createdAt":"2018-02-28T06:14:15.836Z",
        "deleted":false,
        "_id":"5a9648b769e4c5000103cc13",
        "account":"5a7dc92a4cefed0b653f6e48",
        "code":"10001",
        "department":"5a868c739de0580001372f73",
        "type":"clinic",
        "nameEnglish":"Exam",
        "nameArabic":"Exam Arabic",
        "rate":"400",
        "waitingTime":"20",
        "warningTime":"30",
        "createdBy":"5a9648b769e4c5000103cc12",
        "notes":"test",
        "__v":0
     },
     "patientRecord":{  
        "insurance":{  
           "company":null,
           "policy":null,
           "class":null
        },
        "charity":null,
        "contract":null,
        "serviceRecords":[  

        ],
        "invoices":[  

        ],
        "createdAt":"2018-02-20T18:47:14.779Z",
        "deleted":false,
        "_id":"5a8c6d32c54b190001997d9d",
        "serial":"55",
        "account":"5a7dc92a4cefed0b653f6e48",
        "nameEnglish":"Mohamed Ibrahim Nasr",
        "nameArabic":"Arabic Long Name",
        "mobile":2222223,
        "phone":33443324,
        "birthday":"1987-12-31T20:00:00.000Z",
        "occupation":"occ",
        "nationalId":"9999999999",
        "address":"any address",
        "nationality":"Egypt",
        "referral":"no referral",
        "status":"new",
        "category":"VIP",
        "createdBy":"5a8c6d32c54b190001997d9c",
        "notes":"New Notes",
        "__v":0
     },
     "from":"2018-03-03T05:15:00.000Z",
     "to":"2018-03-03T05:30:00.000Z",
     "category":"Wait List",
     "__v":0
  },
//   {  
//      "status":"new",
//      "createdAt":"2018-03-02T11:48:54.842Z",
//      "deleted":false,
//      "_id":"5a993a2638918600013ff4b7",
//      "account":"5a7dc92a4cefed0b653f6e48",
//      "branch":"5a993a2638918600013ff4b6",
//      "doctor":{  
//         "createdAt":"2018-02-24T10:20:51.916Z",
//         "deleted":false,
//         "_id":"5a913c83beb58e0001734f43",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "branch":"5a7e14d8cef9ad0001d8a915",
//         "department":"5a868c739de0580001372f73",
//         "username":"admin2253388",
//         "password":"$2a$10$qIGNsCvPKkVcE3YsjQv9aeRxUh8z9q4lc61qpSrxB.pDZC93vSa6i",
//         "nameEnglish":"Mohamed Nasr",
//         "nameArabic":"Mohamed Nasr",
//         "gender":"female",
//         "mobile":567803080,
//         "phone":567803080,
//         "birthday":"1987-12-31T20:00:00.000Z",
//         "email":"asdsad@asd.com",
//         "nationalId":"97987897",
//         "maritalStatus":"single",
//         "address":"12213",
//         "nationality":"United Arab Emirates",
//         "role":"doctor",
//         "joinDate":"1998-12-31T20:00:00.000Z",
//         "contractType":"Full Time",
//         "policy":"5a868c739de0580001372f73",
//         "passportNumber":"A123123as",
//         "passportIssueDate":"2018-02-19T20:00:00.000Z",
//         "passportExpiryDate":"2018-02-27T20:00:00.000Z",
//         "residency":"13123",
//         "residencyIssueDate":"2018-02-04T20:00:00.000Z",
//         "residencyExpiryDate":"2018-02-27T20:00:00.000Z",
//         "labourCard":"1231313213",
//         "labourCardExpiryDate":"2018-03-08T20:00:00.000Z",
//         "rate":"200",
//         "rateType":"Per Day",
//         "rateOverTime":"400",
//         "leaveDays":"30",
//         "leaveType":"Calendar",
//         "notes":"notees",
//         "__v":0
//      },
//      "service":{  
//         "createdAt":"2018-02-28T06:14:15.836Z",
//         "deleted":false,
//         "_id":"5a9648b769e4c5000103cc13",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "code":"10001",
//         "department":"5a868c739de0580001372f73",
//         "type":"clinic",
//         "nameEnglish":"Exam",
//         "nameArabic":"Exam Arabic",
//         "rate":"400",
//         "waitingTime":"20",
//         "warningTime":"30",
//         "createdBy":"5a9648b769e4c5000103cc12",
//         "notes":"test",
//         "__v":0
//      },
//      "patientRecord":{  
//         "insurance":{  
//            "company":null,
//            "policy":null,
//            "class":null
//         },
//         "charity":null,
//         "contract":null,
//         "serviceRecords":[  

//         ],
//         "invoices":[  

//         ],
//         "createdAt":"2018-02-20T18:47:14.779Z",
//         "deleted":false,
//         "_id":"5a8c6d32c54b190001997d9d",
//         "serial":"55",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "nameEnglish":"Mohamed Ibrahim Nasr",
//         "nameArabic":"Arabic Long Name",
//         "mobile":2222223,
//         "phone":33443324,
//         "birthday":"1987-12-31T20:00:00.000Z",
//         "occupation":"occ",
//         "nationalId":"9999999999",
//         "address":"any address",
//         "nationality":"Egypt",
//         "referral":"no referral",
//         "status":"new",
//         "category":"VIP",
//         "createdBy":"5a8c6d32c54b190001997d9c",
//         "notes":"New Notes",
//         "__v":0
//      },
//      "from":"2018-03-04T05:15:00.000Z",
//      "to":"2018-03-04T05:30:00.000Z",
//      "category":"Wait List",
//      "__v":0
//   },
//   {  
//      "status":"new",
//      "createdAt":"2018-03-02T11:49:16.973Z",
//      "deleted":false,
//      "_id":"5a993a3c38918600013ff4b9",
//      "account":"5a7dc92a4cefed0b653f6e48",
//      "branch":"5a993a3c38918600013ff4b8",
//      "doctor":{  
//         "createdAt":"2018-02-24T10:20:51.916Z",
//         "deleted":false,
//         "_id":"5a913c83beb58e0001734f43",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "branch":"5a7e14d8cef9ad0001d8a915",
//         "department":"5a868c739de0580001372f73",
//         "username":"admin2253388",
//         "password":"$2a$10$qIGNsCvPKkVcE3YsjQv9aeRxUh8z9q4lc61qpSrxB.pDZC93vSa6i",
//         "nameEnglish":"Mohamed Nasr",
//         "nameArabic":"Mohamed Nasr",
//         "gender":"female",
//         "mobile":567803080,
//         "phone":567803080,
//         "birthday":"1987-12-31T20:00:00.000Z",
//         "email":"asdsad@asd.com",
//         "nationalId":"97987897",
//         "maritalStatus":"single",
//         "address":"12213",
//         "nationality":"United Arab Emirates",
//         "role":"doctor",
//         "joinDate":"1998-12-31T20:00:00.000Z",
//         "contractType":"Full Time",
//         "policy":"5a868c739de0580001372f73",
//         "passportNumber":"A123123as",
//         "passportIssueDate":"2018-02-19T20:00:00.000Z",
//         "passportExpiryDate":"2018-02-27T20:00:00.000Z",
//         "residency":"13123",
//         "residencyIssueDate":"2018-02-04T20:00:00.000Z",
//         "residencyExpiryDate":"2018-02-27T20:00:00.000Z",
//         "labourCard":"1231313213",
//         "labourCardExpiryDate":"2018-03-08T20:00:00.000Z",
//         "rate":"200",
//         "rateType":"Per Day",
//         "rateOverTime":"400",
//         "leaveDays":"30",
//         "leaveType":"Calendar",
//         "notes":"notees",
//         "__v":0
//      },
//      "service":{  
//         "createdAt":"2018-02-16T09:45:47.385Z",
//         "deleted":false,
//         "_id":"5a86a84b8742a90001972f7f",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "code":"2222",
//         "department":"5a868c739de0580001372f73",
//         "type":"surgery",
//         "nameEnglish":"sad",
//         "nameArabic":"dasdad",
//         "rate":"222",
//         "waitingTime":"231",
//         "warningTime":"232",
//         "createdBy":"5a86a84b8742a90001972f7e",
//         "notes":"fasd",
//         "__v":0
//      },
//      "patientRecord":{  
//         "insurance":{  
//            "company":null,
//            "policy":null,
//            "class":null
//         },
//         "charity":null,
//         "contract":null,
//         "serviceRecords":[  

//         ],
//         "invoices":[  

//         ],
//         "createdAt":"2018-02-20T18:47:14.779Z",
//         "deleted":false,
//         "_id":"5a8c6d32c54b190001997d9d",
//         "serial":"55",
//         "account":"5a7dc92a4cefed0b653f6e48",
//         "nameEnglish":"Mohamed Ibrahim Nasr",
//         "nameArabic":"Arabic Long Name",
//         "mobile":2222223,
//         "phone":33443324,
//         "birthday":"1987-12-31T20:00:00.000Z",
//         "occupation":"occ",
//         "nationalId":"9999999999",
//         "address":"any address",
//         "nationality":"Egypt",
//         "referral":"no referral",
//         "status":"new",
//         "category":"VIP",
//         "createdBy":"5a8c6d32c54b190001997d9c",
//         "notes":"New Notes",
//         "__v":0
//      },
//      "from":"2018-03-06T05:30:00.000Z",
//      "to":"2018-03-06T05:45:00.000Z",
//      "category":"Wait List",
//      "__v":0
//   }
// ]