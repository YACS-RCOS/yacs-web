import { Component, Input } from '@angular/core';
import { Course } from '../../models/course.model';
import { Section } from '../../models/section.model';
import { SelectionService } from '../../services/selection.service'
import { ConflictsService } from '../../services/conflicts.service';

@Component({
  selector: 'course',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  host: { '[class.selected]': 'isCourseSelected()' }
})
export class CourseComponent {
  @Input() course: Course;

  constructor(
    private selectionService : SelectionService,
    private conflictsService: ConflictsService) { }
  /* A getter function for the range of credits based on the min and max.
   * When {{creditRange}} is used in the template, this function will be called. */
  public get creditRange() {
    let minCredits = this.course.min_credits;
    let maxCredits = this.course.max_credits;
    let outstr = '';
    let plural = true;
    if(minCredits !== maxCredits) {
      outstr = minCredits + '-' + maxCredits + ' credits';
    } else {
      outstr = maxCredits + ' credit';
      if(maxCredits !== 1) {
        outstr += 's';
      }
    }
    return outstr;
  }

  // TODO: This should just return course.department_code.
  // That field needs to be added to the API
  public subjectCode() {
    if (this.course.sections && this.course.sections[0]) {
      return this.course.sections[0].department_code;
    } else {
      return "";
    }
  }

  public clickCourse(course : Course) {
    this.selectionService.toggleCourse(course);
  }

  public isCourseSelected() {
    return this.selectionService.hasSelectedSection(this.course);
  }

  public isSectionSelected(section : Section) : boolean {
    return this.selectionService.isSectionSelected(section);
  }

  public clickSection(section : Section) {
    this.selectionService.toggleSection(section);
  }

  public doesConflict(secId: number) {
    return this.conflictsService.doesConflict(secId);
  }
}
