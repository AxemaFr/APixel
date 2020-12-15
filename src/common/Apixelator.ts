export type APixelConfig = {
  to: HTMLCanvasElement,
  from: HTMLCanvasElement,
  resultPixelSize: number
  // palette: Color[],
  // maxHeight: number,
  // maxWidth: number,
};

export type Pixel = [number, number, number];
export type Color = [number, number, number];

export class APixelator {

  constructor(config: APixelConfig) {
    this.drawFrom = config.from;
    this.drawTo = config.to;
    this.fromCtx = this.drawFrom.getContext('2d') as CanvasRenderingContext2D;
    this.toCtx = this.drawTo.getContext('2d') as CanvasRenderingContext2D;
    this.resultPixelSize = config.resultPixelSize;
  }
  private drawFrom: HTMLCanvasElement;
  private drawTo: HTMLCanvasElement;
  private fromCtx: CanvasRenderingContext2D;
  private toCtx: CanvasRenderingContext2D;
  private resultPixelSize: number;

  public hideFromCanvas(): APixelator {
    this.drawFrom.style.visibility = 'hidden';
    this.drawFrom.style.position = 'fixed';
    this.drawFrom.style.top = '0';
    this.drawFrom.style.left = '0';
    return this;
  }

  public getResultPixelColor(sx: number, sy: number): Color {
    const pixelData = this.fromCtx.getImageData(sx, sy, this.resultPixelSize, this.resultPixelSize);

    const pixels = [];
    for (let sxl = 0; sxl < this.resultPixelSize * this.resultPixelSize * 4; sxl += 4) {
      if (this.drawFrom.width - sx <= sxl + 2 || this.drawFrom.height - sy <= sxl + 2) {
        continue;
      }

      const pixel: Pixel = [
        pixelData.data[sxl],
        pixelData.data[sxl + 1],
        pixelData.data[sxl + 2],
      ];


      pixels.push(pixel);
    }

    console.log(pixels.length);

    const resultColor = {
      r: 0,
      g: 0,
      b: 0,
    };

    pixels.forEach((pixel) => {
      const [r, g, b] = pixel;
      resultColor.r += r;
      resultColor.g += g;
      resultColor.b += b;
    });

    return [
      Math.floor(resultColor.r / pixels.length),
      Math.floor(resultColor.g / pixels.length),
      Math.floor(resultColor.b / pixels.length),
    ];
  }

  public convertImage(): void {
    this.drawTo.height = this.drawFrom.height;
    this.drawTo.width = this.drawFrom.width;

    for (let sx = 0; sx <= this.drawFrom.width; sx += this.resultPixelSize) {
      for (let sy = 0; sy <= this.drawFrom.height; sy += this.resultPixelSize) {
        const [r, g, b]: Color = this.getResultPixelColor(sx, sy);

        this.toCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.toCtx.fillRect(sx, sy, this.resultPixelSize, this.resultPixelSize);
      }
    }
  }

}
