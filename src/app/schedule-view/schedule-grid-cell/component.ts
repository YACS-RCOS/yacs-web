import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'schedule-grid-cell',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})

export class ScheduleGridCellComponent {
  excludedValue: boolean;

  @Output()
  excludedChange = new EventEmitter<boolean>();

  @Input()
  get excluded() {
    return this.excludedValue;
  }

  set excluded(val) {
    this.excludedValue = val;
    this.excludedChange.emit(this.excludedValue);
  }

  toggleExclude() {
    this.excluded = !this.excluded;
  }
}

