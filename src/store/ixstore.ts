
import { Injectable, Inject, Provider } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Operator }   from "rxjs/Operator";
import { Subject }    from "rxjs/Subject";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";

import { IterableX } from "ix/iterable";
import { of }        from "ix/iterable/of";
import "ix/add/iterable-operators/chain";
import "ix/add/iterable-operators/map";
import "ix/add/iterable-operators/reduce";

import { Action, Store, StateObservable, ActionsSubject, ReducerManager } from "@ngrx/store";

import { view, Lens, ERR_VAL } from "./lens";
import { IxAction, ACTION }    from "./models";


@Injectable()
export class IxStore<S> extends Store<S> {

    constructor(
        @Inject(StateObservable) private state$: StateObservable,
        @Inject(ActionsSubject)  private ao: ActionsSubject,
        @Inject(ReducerManager)  private rm: ReducerManager,
    ) {
        super(state$, ao, rm);
    }

    public lens <R> (lens: Lens): IxStore<R> {

        return this.state$
            .map<S, R>(s => {
                const st = view<S, R>(lens)(s);
                return (st === ERR_VAL ? s : st) as R;
            })
            .distinctUntilChanged() as IxStore<R>;
    }

    public lift <R> (operator: Operator<S, R>): IxStore<R> {
        const store = new IxStore<R>(this, this.ao, this.rm);
        store.operator = operator;
        return store;
    }

    public dispatchIx <S, R = S> (action: IxAction<S, R>): Observable<R> {

        let optState: any;

        const obs = this.state$
            .first<any>()
            .map(state => of(state)
                .map(view(action.lens))
                // If lens errors, abort with error.
                .chain(action.transformer)
                .reduce<R>((_, s) => s)
            )
            .do(state => optState = state)
            .mergeMap<R, R>(state => action.observable(state).startWith(state))
            .share<R>();

        obs.subscribe(
            payload => super.dispatch(new IxAction(action.lens, () => of(payload))),
            err => super.dispatch(new IxAction(action.lens, () => of(optState))),
        );

        return obs;
    }
}

export const IXSTORE_PROVIDERS: Provider[] = [IxStore];
