import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IncrementerComponent} from './incrementer.component';
import {ButtonModule} from '../button/button.module';

@NgModule({
  declarations: [IncrementerComponent],
  imports: [
    CommonModule,
    ButtonModule,
  ],
  exports: [IncrementerComponent]
})
export class IncrementerModule { }
