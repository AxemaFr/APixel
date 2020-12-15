import {Component, ElementRef, ViewChild} from '@angular/core';
import {APixelator, APixelConfig} from '../common/Apixelator';


function componentToHex(c: number): any {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): any {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  @ViewChild('canvasElementFrom') canvasFrom: ElementRef | undefined;
  @ViewChild('canvasElementTo') canvasTo: ElementRef | undefined;
  title = 'APixel';

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
        this.canvasTo.nativeElement.width = img.width;
        this.canvasTo.nativeElement.height = img.height;
        const ctx = this.canvasFrom.nativeElement.getContext('2d');
        ctx.drawImage(img, 0, 0);
      };

      if (!event || !event.target || !event.target.result) {
        return;
      }
      img.src = (event.target.result as string);
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  public goTest(): void {
    const config: APixelConfig = {
      to: this.canvasTo?.nativeElement as HTMLCanvasElement,
      from: this.canvasFrom?.nativeElement as HTMLCanvasElement,
      resultPixelSize: 24,
    };

    const pixelator = new APixelator(config);

    pixelator.convertImage();
  }
}
