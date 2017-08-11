
import { Injectable, Inject, Provider } from "@angular/core";

import { Operator } from "rxjs/Operator";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";

import { Action, Store, StateObservable, ActionsSubject, ReducerManager } from "@ngrx/store";

import { IxDispatcher }               from "./ixdispatcher";
import { view, Lens }                 from "./lens";
import { ixAction, IxAction, ACTION } from "./models";


@Injectable()
export class IxStore<S> extends Store<S> {

    constructor(
        @Inject(StateObservable) private state$: StateObservable,
        @Inject(ActionsSubject)  private ao: ActionsSubject,
        @Inject(ReducerManager)  private rm: ReducerManager,
        @Inject(IxDispatcher)    private dispatcher: IxDispatcher,
    ) {
        super(state$, ao, rm);
    }

    public view <R> (lens: Lens): IxStore<R | undefined> {

        const viewLens = view<S, R | undefined>(lens);
        return this.state$
            .map<S, R | undefined>(viewLens)
            .distinctUntilChanged() as IxStore<R | undefined>;
    }

    public lift <R> (operator: Operator<S, R>): IxStore<R> {
        const store = new IxStore<R>(this, this.ao, this.rm, this.dispatcher);
        store.operator = operator;
        return store;
    }

    public dispatchIx <R = S> (action: IxAction<S, R>): void {
        this.dispatcher.dispatchIx(action);
    }

    public dispatchAsyncIx <R = S> (action: IxAction<S, R>): void {
        this.dispatcher.dispatchAsyncIx(action);
    }
}

export const IX_STORE_PROVIDERS: Provider[] = [IxStore, IxDispatcher];
