import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  readonly value = model(false);

  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLInputElement).checked);
  }
}
