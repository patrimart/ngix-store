
import { Component, ChangeDetectionStrategy }  from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IterableX } from "@ngix/ix/iterable";
import { map } from "@ngix/ix/iterable/map";

import { IxStore } from "../store/ixstore";
import { IxAction } from "../store/models";
import { lens  } from "../store/lens";
import { bindFrom, curry as c } from "../store/ix";


export interface AppState {
  counter: number;
}


export const INCREMENT = c(map, (i: number) => i + 1);
export const DECREMENT = c(map, (i: number) => i - 1);
export const RESET = c(map, () => 0);


@Component({
  selector: "app-root",
  template: `
    <button (click)="increment()">Increment</button>
    <div>Current Count: {{ counter | async }}</div>
    <button (click)="decrement()">Decrement</button>

    <button (click)="reset()">Reset Counter</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  public counter: Observable<number>;
  public counterLens = lens("counter");

  public constructor(private store: IxStore<AppState>) {
    this.counter = this.store.view(this.counterLens);
  }

  public increment () {
    this.store.dispatchIx(new IxAction(this.counterLens, bindFrom(INCREMENT)));
  }

  public decrement () {
    this.store.dispatchIx(new IxAction(this.counterLens, bindFrom(DECREMENT)));
  }

  public reset () {
    this.store.dispatchIx(new IxAction(this.counterLens, bindFrom(RESET)));
  }
}
