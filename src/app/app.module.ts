import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { IncrementerModule } from './components/incrementer/incrementer.module';
import {PaletteComponent} from "./components/ palette/palette.component";

@NgModule({
    declarations: [AppComponent, PaletteComponent],
  imports: [BrowserModule, ButtonModule, CheckboxModule, IncrementerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
