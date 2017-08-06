
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { IxStoreModule } from "../store/ixstoremodule";

import { AppComponent } from "./app.component";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IxStoreModule.forRoot({ counter: 0 }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
