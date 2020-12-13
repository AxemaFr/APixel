import {Component, ElementRef, ViewChild} from '@angular/core';


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
  @ViewChild('canvasElement') canvas: ElementRef | undefined;
  title = 'AxemaPixel';

  public handleChange(e: any): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!this.canvas) {
          return;
        }
        this.canvas.nativeElement.width = img.width;
        this.canvas.nativeElement.height = img.height;
        const ctx = this.canvas.nativeElement.getContext('2d');
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
    if (!this.canvas) {
      return;
    }
    const ctx = this.canvas.nativeElement.getContext('2d');
    const canvas = this.canvas.nativeElement;

    const bigPixelSize = 8;

    let sx = 0;
    let sy = 0;

    do {
      const pixelData = ctx.getImageData(sx, sy, bigPixelSize, bigPixelSize);

      const pixels = [];
      for (let i = 0; i < (bigPixelSize ** 2) * 4; i += 4) {
        const pixel = {
          r: pixelData.data[i],
          g: pixelData.data[i + 1],
          b: pixelData.data[i + 2],
        };

        pixels.push(pixel);
      }

      const resultColor = {
        r: 0,
        g: 0,
        b: 0,
      };

      pixels.forEach((pixel) => {
        resultColor.g += pixel.g;
        resultColor.r += pixel.r;
        resultColor.b += pixel.b;
      });

      resultColor.g /= pixels.length;
      resultColor.r /= pixels.length;
      resultColor.b /= pixels.length;

      ctx.fillStyle = rgbToHex(Math.floor(resultColor.r), Math.floor(resultColor.g), Math.floor(resultColor.b));
      ctx.fillRect(sx, sy, bigPixelSize, bigPixelSize);

      sx += bigPixelSize;

      if (sx >= canvas.width) {
        sx = 0;
        sy += bigPixelSize;
      }
    } while (sy < canvas.height);
  }
}
