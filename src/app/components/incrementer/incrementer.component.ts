import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-incrementer',
  templateUrl: './incrementer.component.html',
  styleUrl: './incrementer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncrementerComponent {
  readonly value = model(0);
  readonly step = input(1);
  readonly min = input(0);
  readonly max = input(10);
  /** Accessible name for the +/- buttons, e.g. "pixel size". */
  readonly label = input('value');

  protected readonly canDecrease = computed(() => this.value() > this.min());
  protected readonly canIncrease = computed(() => this.value() < this.max());

  increase(): void {
    this.update(this.value() + this.step());
  }

  decrease(): void {
    this.update(this.value() - this.step());
  }

  private update(next: number): void {
    // Round away float noise (0.1 + 0.2) to the precision of the step, then clamp,
    // so the bounds are always reachable even when they aren't a multiple of the step.
    const decimals = (String(this.step()).split('.')[1] ?? '').length;
    const rounded = Number(next.toFixed(decimals));
    this.value.set(Math.min(this.max(), Math.max(this.min(), rounded)));
  }
}
