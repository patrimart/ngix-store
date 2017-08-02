
import { Injectable, Inject, Provider } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Operator }   from "rxjs/Operator";
import { Subject }    from "rxjs/Subject";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";
import "@ngix/ix/add/iterable-operators/chain";
import "@ngix/ix/add/iterable-operators/map";
import "@ngix/ix/add/iterable-operators/reduce";

import { Action, Store, StateObservable, ActionsSubject, ReducerManager } from "@ngrx/store";

import { view, Lens, ERR_VAL } from "./lens";
import { IxAction, ACTION }    from "./models";
import { IX_REDUCER_STORE }    from "./reducer";


@Injectable()
export class IxStore<S> extends Store<S> {

    constructor(
        @Inject(StateObservable) private state$: StateObservable,
        @Inject(ActionsSubject)  private ao: ActionsSubject,
        @Inject(ReducerManager)  private rm: ReducerManager,
    ) {
        super(state$, ao, rm);
    }

    public view <R> (lens: Lens): IxStore<R> {

        return this.state$
            .pluck<any, any>(IX_REDUCER_STORE)
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

    public dispatchIx <R = S> (action: IxAction<S, R>): Observable<R> {

        let optState: any;

        const obs = this.state$
            .pluck(IX_REDUCER_STORE)
            .first()
            .map(state => of(state)
                .map<any, any>(view(action.lens))
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
