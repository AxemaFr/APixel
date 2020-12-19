 /**
  * APixel - convert an image to Pixel Art, with/out grayscale and based on a color palette with some improvment options
  * @author Artem Myazitov @ <https://github.com/AxemaFr/APixel>
  */


export type APixelConfig = {
  to: HTMLCanvasElement,
  from: HTMLCanvasElement,
  resultPixelSize: number
  palette: Color[],
  scale: number,
  isSpaced: boolean,
  isGrayScale: boolean,
};

export type Pixel = [number, number, number];
export type Color = [number, number, number];

export class APixelator {

  constructor(config: APixelConfig) {
    this.config = config;
    this.fromCtx = config.from.getContext('2d') as CanvasRenderingContext2D;
    this.toCtx = config.to.getContext('2d') as CanvasRenderingContext2D;
  }
  private config: APixelConfig;
  private fromCtx: CanvasRenderingContext2D;
  private toCtx: CanvasRenderingContext2D;

  public hideFromCanvas(): APixelator {
    this.config.from.style.visibility = 'hidden';
    this.config.from.style.position = 'fixed';
    this.config.from.style.top = '0';
    this.config.from.style.left = '0';
    return this;
  }

  public getResultPixelColor(sx: number, sy: number, areaSize: number): Color {
    const pixelData = this.fromCtx.getImageData(sx, sy, areaSize, areaSize);

    const pixels = [];
    for (let sxl = 0; sxl < areaSize ** 2 * 4; sxl += 4) {
      if (this.config.from.width - sx <= sxl + 2 || this.config.from.height - sy <= sxl + 2) {
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
      Math.round(resultColor.r / pixels.length),
      Math.round(resultColor.g / pixels.length),
      Math.round(resultColor.b / pixels.length),
    ];
  }

  public convertImage(): void {
    this.hideFromCanvas();
    this.updateToCanvasSize();

    for (let sx = 0; sx <= this.config.from.width; sx += this.config.resultPixelSize) {
      for (let sy = 0; sy <= this.config.from.height; sy += this.config.resultPixelSize) {
        let color = this.getResultPixelColor(sx, sy, this.config.resultPixelSize);
        if (this.config.palette.length > 0) {
          color = this.getSimilarPaletteColor(color);
        }
        this.fillToCanvasRect(sx, sy, color);
      }
    }

    if (this.config.isGrayScale) {
      this.convertToGrayscale();
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
    let currentColor = this.config.palette[0];
    let currentSim = this.colorSim(color, this.config.palette[0]);

    this.config.palette.forEach((pColor: Color) => {
      const sim = this.colorSim(color, pColor);
      if (sim < currentSim) {
        currentColor = pColor;
        currentSim = sim;
      }
    });

    return currentColor;
  }

  private updateToCanvasSize(): void {
    if (this.config.isSpaced) {
      this.config.to.height = this.config.from.height;
      this.config.to.width = this.config.from.width;

      return;
    }

    this.config.to.height = Math.floor(this.config.from.height * this.config.scale);
    this.config.to.width = Math.floor(this.config.from.width * this.config.scale);
  }

  private fillToCanvasRect(sx: number, sy: number, color: Color): void {
    const [r, g, b] = color;
    this.toCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    if (this.config.isSpaced) {
      this.toCtx.fillRect(
        sx,
        sy,
        Math.ceil(this.config.resultPixelSize * this.config.scale),
        Math.ceil(this.config.resultPixelSize * this.config.scale)
      );

      return;
    }

    this.toCtx.fillRect(
      Math.round(sx * this.config.scale),
      Math.round(sy * this.config.scale),
      Math.ceil(this.config.resultPixelSize * this.config.scale),
      Math.ceil(this.config.resultPixelSize * this.config.scale),
    );
  }

  private convertToGrayscale(): void {
    const w = this.config.to.width;
    const h = this.config.to.height;
    const imgPixels = this.toCtx.getImageData(0, 0, w, h);
    for (let x = 0; x < imgPixels.width; x++) {
      for (let y = 0; y < imgPixels.height; y++) {
        const i = y * 4 * imgPixels.width + x * 4;
        const avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    this.toCtx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
  }
}
