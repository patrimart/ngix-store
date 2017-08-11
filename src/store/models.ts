
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";

import { Action } from "@ngrx/store";

import { Lens } from "./lens";

export const ACTION = "[@ngix/store/action]";


/**
 * IxAction interface for ngix.
 */
export interface IxAction <S, R> extends Action {
    readonly type: string;
    readonly lens: Lens;
    readonly update: (s: Iterable<S>) => IterableX<R>;
    readonly commit: (s: S, o: R) => Observable<IxAction<S, R>>;
}

/**
 * IxAction factory function.
 */
export function ixAction (lens: Lens) {

    return function <S, R> (
        type = lens.join("/"),
        update: (state: Iterable<any>) => IterableX<R>,
        commit = (s: S, o: R) => Observable.empty<IxAction<S, R>>(),
    ): IxAction <S, R> {
        return { type: `${ACTION} ${type}`, lens, update, commit };
    }
}
