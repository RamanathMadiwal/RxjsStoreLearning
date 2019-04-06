import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    const subject = new BehaviorSubject(0);
    //Late subscribtion doesn't work
    // in subject as it doesn't have memory of streams
    //Behaviour Subject
    //Private to part
    //simultaneously observable and observer
    subject.next(1);
    const series$ = subject.asObservable();
    series$.subscribe(val => console.log("early sub" + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);
   // subject.complete();


    setTimeout(() => {
      series$.subscribe(val => {
        console.log("late sub" + val);
      })
    })

    /*OutPut
    * early sub1
about.component.ts:37 early sub1
about.component.ts:37 early sub2
about.component.ts:37 early sub3
about.component.ts:45 late sub3  //
last value is printed
//if you put subject.complete
it doesn't work as doesn't store values
*/

    // Async Subject
    //long running calculation values
    //progressivly reporting the latest values
    //subject.complete is must necessary for this

    //ReplaySubject
    //second subscriber need  all values .even declared after second subscribtion
    //not linked to subject.complete ,dont need to wait

    //Use
    //from('evt','keyup)
    //fromPromise()
  }


}






