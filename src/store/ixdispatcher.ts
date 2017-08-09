
import { Injectable, Inject, Provider } from "@angular/core";

import { Observable }   from "rxjs/Observable";
import { Operator }     from "rxjs/Operator";
import { Subject }      from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { async }        from "rxjs/scheduler/async";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/share";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/subscribeOn";
import "rxjs/add/operator/withLatestFrom";

import { IterableX } from "@ngix/ix/iterable";
import { of }        from "@ngix/ix/iterable/of";
import "@ngix/ix/add/iterable-operators/chain";
import "@ngix/ix/add/iterable-operators/map";
import "@ngix/ix/add/iterable-operators/reduce";

import { ActionsSubject, StateObservable } from "@ngrx/store";

import { view, Lens, ERR_VAL }        from "./lens";
import { ixAction, IxAction, ACTION } from "./models";


@Injectable()
export class IxDispatcher {

    private syncTable: { [lens: string]: (action: IxAction<any, any>) => void } = {};

    private asyncSubject$: Subject<IxAction<any, any>>;
    private asyncSubscription$: Subscription;

    constructor(
        @Inject(StateObservable) private state$: StateObservable,
        @Inject(ActionsSubject) private actions$: ActionsSubject,
    ) {
        this.asyncSubject$ = new Subject<IxAction<any, any>>();
        this.asyncSubscription$ = this.asyncSubject$
            .withLatestFrom(
                this.state$,
                (a, s) => [a, s, of(s)
                    .map<any, any>(view(a.lens))
                    .chain(a.update)
                    .reduce((__, o) => o),
                ],
            )
            .mergeMap(([a, s, o]) => a.commit(s, o).startWith(ixAction(a.lens)(a.type, () => of(o))))
            .subscribeOn(async)
            .subscribe((a: any) => this.actions$.next(a));
    }

    public dispatchIx <S, R = S> (action: IxAction<S, R>): void {
        this.getSyncDispatcher(action.lens)(action);
    }

    public dispatchAsyncIx <S, R = S> (action: IxAction<S, R>): void {
        this.asyncSubject$.next(action);
    }

    private getSyncDispatcher <S, R> (lens: Lens): (action?: IxAction<S, R>) => void {

        const key = lens.join(".");
        if (key in this.syncTable === false) {

            const subject = new Subject<IxAction<any, any>>();
            const subscription = subject
                .withLatestFrom(
                    this.state$,
                    (a, s) => [a, s, of(s)
                        .map<any, any>(view(a.lens))
                        .chain(a.update)
                        .reduce((__, o) => o),
                    ],
                )
                .concatMap(([a, s, o]) => a.commit(s, o).startWith(ixAction(a.lens)(a.type, () => of(o))))
                // .subscribeOn(async)
                .subscribe((a: any) => this.actions$.next(a));

            this.syncTable[key] = function (action?: IxAction<S, R>): void {

                if (action === undefined) {
                    subscription.unsubscribe();
                    subject.complete();
                    return;
                }

                subject.next(action);
            }
        }

        return this.syncTable[key];
    }
}
