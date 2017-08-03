import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { StoreModule } from "@ngrx/store";

import { IxStoreModule } from "../store/ixstoremodule";

import { AppComponent } from "./app.component";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IxStoreModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
