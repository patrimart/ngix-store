
import { Injectable, Inject, Provider } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Operator }   from "rxjs/Operator";
import { async }      from "rxjs/scheduler/async";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/subscribeOn";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";
import "@ngix/ix/add/iterable-operators/chain";
import "@ngix/ix/add/iterable-operators/map";
import "@ngix/ix/add/iterable-operators/reduce";

import { Action, Store, StateObservable, ActionsSubject, ReducerManager } from "@ngrx/store";

import { view, Lens, ERR_VAL }        from "./lens";
import { ixAction, IxAction, ACTION } from "./models";


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

        const viewLens = view<S, R>(lens);
        return this.state$
            .map<S, R>(s => {
                const st = viewLens(s);
                if (st === ERR_VAL) { throw new Error(`The lens (${lens.join(".")}) could not resolve.`); }
                return st as R;
            })
            .distinctUntilChanged() as IxStore<R>;
    }

    public lift <R> (operator: Operator<S, R>): IxStore<R> {
        const store = new IxStore<R>(this, this.ao, this.rm);
        store.operator = operator;
        return store;
    }

    public dispatchIx <R = S> (action: IxAction<S, R>): Observable<R> {

        const stateView = view(action.lens);

        const obs = this.state$.first()
            .map(s => [
                s, of(s)
                    .map<any, any>(stateView)
                    .chain(action.update)
                    .reduce((__, o) => o),
            ])
            .concatMap(([s, o]) =>
                action.commit(o)
                    .catch(() => Observable.of(of(s)
                        .map<any, any>(stateView)
                        .chain(action.rollback || (() => of(s)))
                        .reduce((__, oo) => oo)),
                    )
                    .startWith(o),
            )
            .subscribeOn(async) // To allow sub-tick cleanup after a dispatchIx.
            .share();

        obs.subscribe(s => super.dispatch(ixAction(action.lens)(() => of(s))));

        return obs;
    }
}

export const IX_STORE_PROVIDERS: Provider[] = [IxStore];

