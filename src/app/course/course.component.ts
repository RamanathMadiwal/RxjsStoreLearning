import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, first, take
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';
import {forkJoin} from "rxjs/internal/observable/forkJoin";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;


  @ViewChild('searchInput') input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {


  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];

    this.course$ = this.store.selectCourseById(this.courseId);

    // //CASE 1
    // //first
    // //Usually the above observable is not complete
    // this.course$ = this.store.selectCourseById(this.courseId).pipe(
    //   first()
    // )
    // //forkjoin waits for each observable to
    // // complete so use first -->emits the first value
    // forkJoin(this.course$, this.loadLessons()).subscribe(console.log)


    //CASE 2
    //take
    //limit the number of values
    //take(2) so  a,b,c,d
    //only and b and immediately completes

    // this.course$ = this.store.selectCourseById(this.courseId).pipe(
    //   take(1)
    // )
    // //forkjoin waits for each observable to
    // // complete so use first -->emits the first value
    // forkJoin(this.course$, this.loadLessons()).subscribe(console.log)

    //CASE 3
    //withlatestfrom -->tuple
    //multiple values of observables combined
    //latest values source observables values with latest value in
    // stream 2 at the previous moment/interval
    // this.loadLessons().pipe(
    //   withLatestFrom(this.course$)
    // ).subscribe(([lessons, course]) => {
    //   console.log("lessons", lessons);
    //   console.log("course", course);
    // })

  }

  ngAfterViewInit() {

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res["payload"])
      );
  }


}











