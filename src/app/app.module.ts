import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ButtonModule} from './components/button/button.module';
import {CheckboxModule} from './components/checkbox/checkbox.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        ButtonModule,
        CheckboxModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
