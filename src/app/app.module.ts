import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { StoreModule } from "@ngrx/store";

import { IXSTORE_PROVIDERS } from "../store/ixstore";
import { createIxReducer } from "../store/reducer";

import { AppComponent } from "./app.component";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // TODO IxStoreModule.forRoot({ ...createIxReducer({ counter: 0 }) }), // Which has StoreModule.forRoot in it.
    StoreModule.forRoot({ ...createIxReducer({ counter: 0 }) })
  ],
  providers: [
    IXSTORE_PROVIDERS, // This will go into IxStoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
