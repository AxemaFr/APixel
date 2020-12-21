import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.styl'],
})
export class PaletteComponent {
  @Input() currentIndexPallet = 0;
  @Input() palettes = [
    [
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
    ],
    [
      [110, 184, 168],
      [42, 88, 79],
      [116, 163, 63],
      [252, 255, 192],
      [198, 80, 90],
      [47, 20, 47],
      [119, 68, 72],
      [238, 156, 93],
    ],
  ];
  @Input() palette = this.palettes[0];
  @Output() paletteChange = new EventEmitter();

  public nextPalette(): void {
    this.currentIndexPallet += 1;
    if (this.currentIndexPallet >= this.palettes.length) { this.currentIndexPallet = 0; }
    this.palette = this.palettes[this.currentIndexPallet];
    this.paletteChange.emit(this.palette);
  }

  public prevPalette(): void {
    this.currentIndexPallet -= 1;
    if (this.currentIndexPallet < 0) { this.currentIndexPallet = this.palettes.length - 1; }
    this.palette = this.palettes[this.currentIndexPallet];
    this.paletteChange.emit(this.palette);
  }
}
