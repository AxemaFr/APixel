import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.styl'],
})
export class CheckboxComponent {
  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();

  @Output() testEvent = new EventEmitter<string>();

  public onCheckboxChange(event: Event): void {
    this.testEvent.emit('Hello');
    if (!event.target) {
      return;
    }
    // @ts-ignore
    this.valueChange.emit(event.target.checked);
  }
}
