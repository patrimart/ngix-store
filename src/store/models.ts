
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/empty";

import { IterableX } from "@reactivex/ix-ts/iterable";
import { of }        from "@reactivex/ix-ts/iterable/of";

import { Action } from "@ngrx/store";

import { Lens } from "@ngix/lens";

import { IxFunction } from "./ix";

export const ACTION = "[@ngix/store/action]";


/**
 * IxAction interface for ngix.
 */
export interface IxAction <S> extends Action {
    readonly type: string;
    readonly lens: Lens;
    readonly update: IxFunction<S>;
    readonly commit: (s: S, o: S) => Observable<IxAction<S>>;
}

/**
 * IxAction factory function.
 */
export function ixAction <S> (lens: Lens) {

    return function (
        type = lens.join("/"),
        update: IxFunction<S>,
        commit = (s: S, o: S) => Observable.empty<IxAction<S>>(),
    ): IxAction <S> {
        return { type: `${ACTION} ${type}`, lens, update, commit };
    }
}
