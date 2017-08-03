# @ngix/store

### NOT FOR PRODUCTION USE.

IxJS augmented state management for Angular applications, inspired by Redux and built upon [@ngrx](https://github.com/ngrx/platform).

`@ngix/store` is an attempt to implement an even more functional approach to `@ngrx`. This library is not a replacement for `@ngrx`, but rather a companion library.

Core tenents:

- Play happily and seemlessly with `@ngrx`.
- Less Action and Reducer boilerplate.
- One agnostic reducer. Anonymous actions.
- Keep all store logic in one place. One file.
- Lively data with optimistic updates.
- Stay small and simple.
- Functions, functions, functions.

### Installation

Install @ngix/store from npm:

`npm i @ngix/store @ngix/ix -S`

### Setup

This is the simple example from `@ngrx/store` reworked to use `@ngix/store`.

First, setup of the reducer is omitted since `@ngix/store` has one agnostic recuder.

Second, very much like the original example, register the state container within your application, use the `IxStoreModule.forRoot()`.

```ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { StoreModule } from "@ngrx/store";
import { IxStoreModule } from "@ngix/store";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    IxStoreModule.forRoot(),
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

Finally, inject the `IxStore` service into your components and services. Use `store.view(Lens)` to _focus_ on slice(s) of state. Here you see another fundemental difference between `@ngrx/store` and `@ngix/store`: instead of your logic being off in a reducer where you send potentially stale state, you compose functions and dispatch them to be lazily evaluated in the IxReducer.

```ts
import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IterableX } from "@ngix/ix/iterable";
import { map } from "@ngix/ix/iterable/map";

import { IxStore, IxAction, lens, ix } from "@ngix/store";

export interface AppState {
  counter: number;
}

export const INCREMENT = ix.curry<number>(map, i => i + 1);
export const DECREMENT = ix.curry<number>(map, i => i - 1);
export const RESET = ix.curry<number>(map, () => 0);

@Component({
  selector: "app-root",
  template: `
    <button (click)="increment()">Increment</button>
    <div>Current Count: {{ counter | async }}</div>
    <button (click)="decrement()">Decrement</button>

    <button (click)="reset()">Reset Counter</button>
  `,
})
export class AppComponent {

  public counter: Observable<number>;
  public counterLens = lens.lens("counter");

  public constructor(private store: IxStore<AppState>) {
    this.counter = this.store.view(this.counterLens);
  }

  public increment () {
    this.store.dispatchIx(new IxAction(this.counterLens, ix.bindFrom(INCREMENT)));
  }

  public decrement () {
    this.store.dispatchIx(new IxAction(this.counterLens, ix.bindFrom(DECREMENT)));
  }

  public reset () {
    this.store.dispatchIx(new IxAction(this.counterLens, ix.bindFrom(RESET)));
  }
}
```

### More Docs and Examples Coming Soon

Stay tuned...

---

## License ##

The MIT License (MIT)

Copyright (c) Patrick Martin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
