import {Component, ElementRef, ViewChild} from '@angular/core';
import {APixelator, APixelConfig, Color} from '../common/Apixelator';

const minecraftPalette: Color[] = [
  [221, 221, 221], // white,
  [219, 125, 62], // organge,
  [179, 80, 188], // darkrose,
  [107, 138, 201], // lightblue
  [177, 166, 39], // yellow
  [65, 174, 56], // green
  [208, 132, 153], // rose
  [64, 64, 64], // darkgray
  [154, 161, 161], // lightgray
  [46, 110, 137], // blue
  [126, 61, 161], // phiol
  [46, 56, 141], // darkblue
  [79, 50, 31], // korichnevii
  [53, 70, 27], // darkgreen
  [150, 52, 48], // red
  [25, 22, 22], // black
];

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
      resultPixelSize: 8,
      palette: minecraftPalette,
    };

    const pixelator = new APixelator(config);

    pixelator.convertImage();
  }
}
