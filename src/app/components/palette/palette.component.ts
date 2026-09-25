import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { Palette, PALETTES } from '../../core/palettes';
import { toCssColor } from '../../core/pixelator';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteComponent {
  readonly palettes = input<readonly Palette[]>(PALETTES);
  readonly index = model(0);

  protected readonly current = computed(() => this.palettes()[this.index()]);
  protected readonly toCssColor = toCssColor;

  next(): void {
    this.index.set((this.index() + 1) % this.palettes().length);
  }

  prev(): void {
    const count = this.palettes().length;
    this.index.set((this.index() - 1 + count) % count);
  }
}
