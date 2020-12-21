import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { APixelator, APixelConfig } from '../common/Apixelator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('canvasElementFrom') canvasFrom: ElementRef | undefined;
  @ViewChild('canvasElementTo') canvasTo: ElementRef | undefined;
  title = 'APixel';

  public isGrayScale = false;
  public isSpaced = false;
  public scale = 0.5;
  public resultPixelSize = 8;
  public currentPalette = [];

  public handleChange(e: any): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!this.canvasFrom || !this.canvasTo) {
          return;
        }
        this.canvasFrom.nativeElement.width = img.width;
        this.canvasFrom.nativeElement.height = img.height;
        const ctx = this.canvasFrom.nativeElement.getContext('2d');
        ctx.drawImage(img, 0, 0);
      };

      if (!event || !event.target || !event.target.result) {
        return;
      }
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  public goTest(): void {
    const config = {
      to: this.canvasTo?.nativeElement as HTMLCanvasElement,
      from: this.canvasFrom?.nativeElement as HTMLCanvasElement,
      resultPixelSize: this.resultPixelSize,
      palette: this.currentPalette,
      scale: this.scale,
      isSpaced: this.isSpaced,
      isGrayScale: this.isGrayScale,
    };

    const pixelator = new APixelator(config);

    pixelator.convertImage();
  }

  public setScale(): void {
    this.scale = 0.2;
  }
}
