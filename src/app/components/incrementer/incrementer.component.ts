import { Component, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-incrementer',
  templateUrl: './incrementer.component.html',
  styleUrls: ['./incrementer.component.styl'],
})
export class IncrementerComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() step = 1;
  @Input() maxValue = 10;
  @Input() minValue = -5;
  @Output() valueChange = new EventEmitter();

  inc(): void {
    const newValue = Math.round((this.value + this.step) * 10) / 10;
    if (newValue > this.maxValue) {
      return;
    }

    this.valueChange.emit(Math.round((this.value + this.step) * 10) / 10);
  }

  desc(): void {
    const newValue = Math.round((this.value - this.step) * 10) / 10;
    if (newValue < this.minValue) {
      return;
    }

    this.valueChange.emit(Math.round((this.value - this.step) * 10) / 10);
  }
}
