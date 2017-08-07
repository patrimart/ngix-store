
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";

import { Action } from "@ngrx/store";

import { Lens } from "./lens";

export const ACTION = "[@ngix/store/action]";

const DEFAULT_COMMIT = <R> (optimisticState: R) => Observable.empty<R>();
const DEFAULT_ROLLBACK = <S, R> (currentState: S) =>  (optimisticState: R) => of(currentState);

/**
 * IxAction interface for ngix.
 */
export interface IxAction <S, R> extends Action {
    readonly type: string;
    readonly lens: Lens;
    readonly update: (state: Iterable<S>) => IterableX<R>;
    readonly commit: (optimisticState: R) => Observable<R>;
    readonly rollback?: (state: Iterable<R>) => IterableX<S>;
}

/**
 * IxAction factory function.
 */
export function ixAction (lens: Lens) {

    return function <S, R> (
        update: (state: Iterable<any>) => IterableX<R>,
        type = lens.join("/"),
        commit = DEFAULT_COMMIT,
        rollback?: (state: Iterable<R>) => IterableX<S>,
    ): IxAction <S, R> {
        return { type: `${ACTION} ${type}`, lens, update, commit, rollback };
    }
}
