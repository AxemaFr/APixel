import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { PaletteModule } from './components/palette/palette.module';
import { IncrementerModule } from './components/incrementer/incrementer.module';
import { UploaderComponent } from './components/uploader/uploader.component';


@NgModule({
  declarations: [AppComponent, UploaderComponent],
  imports: [BrowserModule, ButtonModule, CheckboxModule, IncrementerModule, PaletteModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
