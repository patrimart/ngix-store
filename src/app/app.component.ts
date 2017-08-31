
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IterableX } from "@reactivex/ix-ts/iterable";
import { map } from "@reactivex/ix-ts/iterable/map";

import { IxStore } from "../store/ixstore";
import { ixAction, IxAction } from "../store/models";
import { lens  } from "../store/lens";
import { bindFrom as bf, lift, constant } from "../store/ix";


export interface AppState {
  counter: number;
}


const cl = lens("counter");
const ca = ixAction(cl);
const lmap = lift<number>(map);
const INCREMENT = lmap(i => i + 1);
const DECREMENT = lmap(i => i - 1);
const RESET = constant(0);


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
    this.counter = this.store.view(cl);
  }

  public increment () {
    this.store.dispatchIx(ca("INCREMENT", INCREMENT));
  }

  public decrement () {
    this.store.dispatchIx(ca("DECREMENT", DECREMENT));
  }

  public reset () {
    this.store.dispatchIx(ca("RESET", RESET));
  }
}
