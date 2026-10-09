import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, signal, viewChild } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { IncrementerComponent } from './components/incrementer/incrementer.component';
import { PaletteComponent } from './components/palette/palette.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { ImageLoadError, loadImageData } from './core/image-loader';
import { PALETTES } from './core/palettes';
import { effectiveScale, renderPixelArt } from './core/pixelator';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent, CheckboxComponent, IncrementerComponent, PaletteComponent, UploaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:paste)': 'onPaste($event)',
  },
})
export class AppComponent {
  protected readonly palettes = PALETTES;

  protected readonly pixelSize = signal(8);
  protected readonly scale = signal(1);
  protected readonly grayscale = signal(false);
  protected readonly grid = signal(false);
  protected readonly paletteIndex = signal(0);

  protected readonly source = signal<ImageData | null>(null);
  protected readonly loading = signal(false);
  protected readonly dragging = signal(false);
  protected readonly error = signal<string | null>(null);
  private readonly fileName = signal('image');

  protected readonly resultSize = computed(() => {
    const source = this.source();
    if (!source) {
      return null;
    }
    const scale = effectiveScale(source.width, source.height, this.scale());
    return `${Math.max(1, Math.round(source.width * scale))}×${Math.max(1, Math.round(source.height * scale))}`;
  });

  private readonly originalCanvas = viewChild<ElementRef<HTMLCanvasElement>>('original');
  private readonly resultCanvas = viewChild<ElementRef<HTMLCanvasElement>>('result');
  private loadId = 0;

  constructor() {
    effect(() => {
      const source = this.source();
      const canvas = this.originalCanvas()?.nativeElement;
      if (!source || !canvas) {
        return;
      }
      canvas.width = source.width;
      canvas.height = source.height;
      canvas.getContext('2d')?.putImageData(source, 0, 0);
    });

    effect(() => {
      const source = this.source();
      const canvas = this.resultCanvas()?.nativeElement;
      if (!source || !canvas) {
        return;
      }
      renderPixelArt(canvas, source, {
        pixelSize: this.pixelSize(),
        scale: this.scale(),
        palette: this.palettes[this.paletteIndex()]?.colors ?? null,
        grayscale: this.grayscale(),
        grid: this.grid(),
      });
    });
  }

  async loadFile(file: File): Promise<void> {
    const id = ++this.loadId;
    this.loading.set(true);
    this.error.set(null);

    try {
      const imageData = await loadImageData(file);
      if (id !== this.loadId) {
        return; // A newer file was picked while this one was decoding.
      }
      this.source.set(imageData);
      this.fileName.set(file.name.replace(/\.[^.]+$/, '') || 'image');
    } catch (e) {
      if (id === this.loadId) {
        this.error.set(e instanceof ImageLoadError ? e.message : 'Something went wrong while loading the image');
      }
    } finally {
      if (id === this.loadId) {
        this.loading.set(false);
      }
    }
  }

  download(): void {
    const canvas = this.resultCanvas()?.nativeElement;
    if (!canvas) {
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.fileName()}-pixel.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url));
    }, 'image/png');
  }

  protected onPaste(event: ClipboardEvent): void {
    const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'));
    if (file) {
      event.preventDefault();
      void this.loadFile(file);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    // `dragleave` also fires when moving between children of the drop zone.
    const zone = event.currentTarget as HTMLElement;
    if (!zone.contains(event.relatedTarget as Node | null)) {
      this.dragging.set(false);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      void this.loadFile(file);
    }
  }
}
