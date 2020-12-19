import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.styl']
})
export class CheckboxComponent {
  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();


  public onCheckboxChange(event: Event): void {
    if (!event.target) {
      return;
    }
    // @ts-ignore
    this.valueChange.emit(event.target.checked);
  }
}
