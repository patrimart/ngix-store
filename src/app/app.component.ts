
import { Component, ChangeDetectionStrategy }  from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IterableX } from "@ngix/ix/iterable";
import { map } from "@ngix/ix/iterable/map";

import { IxStore } from "../store/ixstore";
import { ixAction, IxAction } from "../store/models";
import { lens  } from "../store/lens";
import { bindFrom as bf, lift } from "../store/ix";


export interface AppState {
  counter: number;
}


export const COUNTER_LENS = lens("counter");
export const ca = ixAction(COUNTER_LENS);
export const INCREMENT = lift<number>(map, i => i + 1);
export const DECREMENT = lift<number>(map, i => i - 1);
export const RESET = lift<number>(map, () => 0);


@Component({
  selector: "app-root",
  template: `
    <div>Current Count: {{ counter | async | json }}</div>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>

    <button (click)="reset()">Reset</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  public counter: Observable<number>;

  public constructor(private store: IxStore<AppState>) {
    this.counter = this.store.view(COUNTER_LENS);
  }

  public increment () {
    this.store.dispatchAsyncIx(ca("INCREMENT", bf(INCREMENT)));
  }

  public decrement () {
    this.store.dispatchIx(ca("DECREMENT", bf(DECREMENT)));
  }

  public reset () {
    this.store.dispatchIx(ca("RESET", bf(RESET)));
  }
}
