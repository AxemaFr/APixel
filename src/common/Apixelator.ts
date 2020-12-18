export type APixelConfig = {
  to: HTMLCanvasElement,
  from: HTMLCanvasElement,
  resultPixelSize: number
  palette: Color[],
  scale: number
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
    this.palette = config.palette;
    this.scale = config.scale;
  }
  private drawFrom: HTMLCanvasElement;
  private drawTo: HTMLCanvasElement;
  private fromCtx: CanvasRenderingContext2D;
  private toCtx: CanvasRenderingContext2D;
  private resultPixelSize: number;
  private palette: Color[];
  private scale: number;

  public hideFromCanvas(): APixelator {
    this.drawFrom.style.visibility = 'hidden';
    this.drawFrom.style.position = 'fixed';
    this.drawFrom.style.top = '0';
    this.drawFrom.style.left = '0';
    return this;
  }

  public getResultPixelColor(sx: number, sy: number, areaSize: number): Color {
    const pixelData = this.fromCtx.getImageData(sx, sy, areaSize, areaSize);

    const pixels = [];
    for (let sxl = 0; sxl < areaSize ** 2 * 4; sxl += 4) {
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
    // TODO: if we dont set height, width, sx, sy depending on scale then we will have beautiful picture
    this.drawTo.height = this.drawFrom.height * this.scale;
    this.drawTo.width = this.drawFrom.width * this.scale;

    for (let sx = 0; sx <= this.drawFrom.width; sx += this.resultPixelSize) {
      for (let sy = 0; sy <= this.drawFrom.height; sy += this.resultPixelSize) {
        let [r, g, b] = this.getResultPixelColor(sx, sy, this.resultPixelSize);
        if (this.palette.length > 0) {
          [r, g, b] = this.getSimilarPaletteColor([r, g, b]);
        }
        this.toCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        // TODO: if we dont set height, width, sx, sy depending on scale then we will have beautiful picture
        this.toCtx.fillRect(sx * this.scale, sy * this.scale, this.resultPixelSize * this.scale, this.resultPixelSize * this.scale);
      }
    }
  }

  public colorSim(color: Color, compareColor: Color): number {
    let d = 0;
    for (let i = 0; i < color.length; i++) {
      d += (color[i] - compareColor[i]) ** 2;
    }
    return Math.sqrt(d);
  }

  public getSimilarPaletteColor(color: Color): Color {
    let currentColor = this.palette[0];
    let currentSim = this.colorSim(color, this.palette[0]);

    this.palette.forEach((pColor: Color) => {
      const sim = this.colorSim(color, pColor);
      if (sim < currentSim) {
        currentColor = pColor;
        currentSim = sim;
      }
    });

    return currentColor;
  }

}
