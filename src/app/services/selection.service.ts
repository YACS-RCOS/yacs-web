import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import {Subject,Subscription, Subscriber} from 'rxjs/Rx';

import { Section } from '../course-list/section/section';
import { Course } from '../course-list/course/course';

@Injectable()
export class SelectionService {

  private clickEvent = new Subject();

  subscribe(next): Subscription {
    return this.clickEvent.subscribe(next);
  }
  next(event){
    this.clickEvent.next(event);
  }

  public toggleSection(section : Section) {
    
    this.isSectionSelected(section) ? this.removeSection(section) : this.addSection(section);
    this.next('event'); //this should be changed
  }

  public addSection(section : Section) {
    let store = this.getSelections();
    store[section.course_id] = store[section.course_id] || [];
    if (store[section.course_id].includes(section.id)) return false;
    store[section.course_id].push(section.id);
    store[section.course_id].sort();
    localStorage.setItem('selections', JSON.stringify(store));
    return true;
  }

  public removeSection(section : Section) {
    let store = this.getSelections();
    if (!store[section.course_id] || !store[section.course_id].includes(section.id)) return false;
    store[section.course_id].splice(store[section.course_id].indexOf(section.id), 1);
    if (store[section.course_id].length == 0) {
      delete store[section.course_id];
    }
    localStorage.setItem('selections', JSON.stringify(store));
    return true;
  }

  public toggleCourse(course : Course) {
    
    if (this.hasSelectedSection(course)) {
      let store = this.getSelections();
      delete store[course.id];
      localStorage.setItem('selections', JSON.stringify(store));
    } else {
      course.sections.forEach((s) => {
        if (s.seats_taken < s.seats) {
          this.addSection(s);
        }
      });
    }
    this.next('event');
  }

  public isSectionSelected(section : Section) : boolean {
    let store = this.getSelections();
    return store && store[section.course_id] && store[section.course_id].includes(section.id);
  }

  public hasSelectedSection(course : Course) : boolean {
    let store = this.getSelections();
    return store && store[course.id] && store[course.id].length > 0;
  }

  public getSelections() {
    return JSON.parse(localStorage.getItem('selections')) || {};
  }
}
