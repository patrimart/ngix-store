
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";

import { Action } from "@ngrx/store";

import { Lens } from "./lens";

export const ACTION = "[@ngix/store/action]";

const DEFAULT_OBS = <R> (optimisticState: R) => Observable.empty<R>();
const DEFAULT_UNDO = <S, R> (optimisticState: R) => of<S>(optimisticState as any);

/**
 * IxAction interface for ngix.
 */
export interface IxAction <S, R> extends Action {
    readonly type: string;
    readonly lens: Lens;
    readonly transformer: (state: Iterable<S>) => IterableX<R>;
    readonly observable: (optimisticState: R) => Observable<R>;
    readonly undo: (optimisticState: R) => IterableX<S>;
}

/**
 * IxAction factory function.
 */
export function ixAction (lens: Lens) {

    return function <S, R> (
        transformer: (state: Iterable<any>) => IterableX<R>,
        type = lens.join("/"),
        observable = DEFAULT_OBS,
        undo = DEFAULT_UNDO,
    ): IxAction <S, R> {
        return { type: `${ACTION} ${type}`, lens, transformer, observable, undo };
    }
}
