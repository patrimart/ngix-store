
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";

import { Action } from "@ngrx/store";

import { Lens } from "./lens";

export const ACTION = "[@ngix/store/action]";

/**
 * Action for ngix.
 */
export class IxAction <S, R = S> implements Action {

    public readonly type: string;

    constructor (
        public readonly lens: Lens,
        public readonly transformer: (state?: Iterable<S>) => IterableX<R>,
        public readonly observable = (optimisticState: R) => Observable.empty<R>(),
        public readonly undo = (optimisticState: R) => of<S>(optimisticState as any),
    ) {
        this.type = `${ACTION} ${this.lens.join("/")}`;
    }
}
