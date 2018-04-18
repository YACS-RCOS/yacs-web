
import {} from 'jasmine';
import { Http, Response, HttpModule } from '@angular/http';
import { TestBed, fakeAsync, tick, ComponentFixture, async } from '@angular/core/testing';
import { Component, OnInit, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead.module';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-config';

import { RouterTestingModule } from '@angular/router/testing';

import * as Stubs from '../../lib/router-stubs';

import { HeaderComponent } from './component';
import { YacsService } from '../services/yacs.service';

let mockRouter:any;
    class MockRouter {
        navigate = jasmine.createSpy('navigate');
    }

class YacsServiceMock {
  get(path: string, params: Object = {}): Promise<Object> {
    var json_data: Object =
      {
        "courses": [
          { "id": 1, "name": "Mock Course 1", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 2, "name": "Mock Course 2", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 3, "name": "Mock Course 3", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 4, "name": "Mock Course 4", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 5, "name": "Mock Course 5", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 6, "name": "Mock Course 6", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 7, "name": "Mock Course 7", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 8, "name": "Mock Course 8", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 9, "name": "Mock Course 9", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 10, "name": "Mock Course 10", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 10, "name": "Mock Course 11", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 10, "name": "Mock Course 12", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },

          { "id": 11, "name": "Graph Theory", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 12, "name": "Graph Theory", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },

          { "id": 13, "name": "Computer Algorithms", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 },
          { "id": 14, "name": "Introduction to Computer Algorithms", "number": 1, "min_credits": 4, "max_credits": 4, "description": "test", "department_id": 1 }
        ]
      };
    return Promise.resolve(json_data);
  }
}   
  
describe("Testing header component", function() {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
       providers: [ { provide: Router, useValue: mockRouter } ],
       declarations: [ HeaderComponent, Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('nav'));
    element  = de.nativeElement;
  }));

  it("should have a component", function() {
    expect(component).toBeDefined();
  });

  it("should contain links", function() {
    expect(element.textContent).toContain("YACS beta");
    expect(element.textContent).toContain("Schedule");
  });
});

describe("Testing TypeAhead Search Bar", function() {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), NgbTypeaheadModule.forRoot()],
      providers: [
        { provide: YacsService, useClass: YacsServiceMock },
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [ HeaderComponent, Stubs.RouterLinkStubDirective, Stubs.RouterOutletStubComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    mockRouter.initialNavigation();

    component = fixture.componentInstance;
    location = TestBed.get(Location);
  }));

  //Test Search
  it('Should navigate to correct URL', fakeAsync(() => {

    mockRouter.navigate(['Mock']);
    tick();
    expect(location.path()).toBe('/courses?search=Mock');

    mockRouter.navigate(['Graph Theory']);
    tick();
    expect(location.path()).toBe('/courses?search=Graph Theory');
  }));

  //gets search bar drop down as array
  function getWindowLinks(element: DebugElement): DebugElement[] {
    return Array.from(element.queryAll(By.css('button.dropdown-item')));
  }

  //Test searchAhead
  it('should display correct dropdown', fakeAsync(() => {

    const searchBarHTML = fixture.debugElement.query(By.css('#searchbar')).nativeElement;
    searchBarHTML.value = "Mock";
    fixture.detectChanges();

    tick(300);

    let dropDown: DebugElement[] = getWindowLinks(fixture.debugElement);

    //test if drop down has correct elements
    for (let i = 0; i < 10; i++) {
      let num: number = i+1;
      expect(dropDown[i].nativeElement.textContent).toEqual("Mock Course " + num.toString());  
    }

    expect(dropDown[10].nativeElement.textContent).not.toEqual("Mock Course 11"); 
    expect(dropDown[11].nativeElement.textContent).not.toEqual("Mock Course 12"); 

      
    //test if click navigates to correct page
    // dropDown[0].triggerEventHandler('click', {});
    // fixture.detectChanges();

    // tick(300);



  //   for (let i : number = 0; i < 10; i++) {
  //     expect(component.searchAhead("Mock")).toContain("Mock Course " + i);
  //   }

  // expect(component.searchAhead("Mock").length).not.toContain("Mock Course 11");
  // expect(component.searchAhead("Mock").length).not.toContain("Mock Course 12");

  // expect(component.searchAhead("Graph").length).toEqual(1);
  // expect(component.searchAhead("Graph").length).toContain("Graph Theory");
  }))

  //Test selectCourse
  it('should navigate to correct URL on dropdown click', function () {
    expect(mockRouter.calls.any()).toEqual(true);
  })
});