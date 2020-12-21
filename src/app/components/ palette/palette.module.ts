import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaletteComponent} from './palette.component';

@NgModule({
  declarations: [PaletteComponent],
  imports: [
    CommonModule,
  ],
  exports: [PaletteComponent]
})
export class PaletteModule { }
