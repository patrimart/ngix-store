
import { Injectable, Inject } from "@angular/core";

import { Observable }   from "rxjs/Observable";
import { Subject }      from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/concatMap";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/do";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/share";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/withLatestFrom";

import { IterableX } from "ix/iterable";
import { of }        from "ix/iterable/of";
import "ix/add/iterable-operators/chain";
import "ix/add/iterable-operators/map";
import "ix/add/iterable-operators/reduce";

import { ActionsSubject, StateObservable } from "@ngrx/store";

import { view, Lens } from "./lens";
import { ixAction, IxAction } from "./models";


const LENS_DELIMITER = `\\\\\\`;


@Injectable()
export class IxDispatcher {

    private syncTable: { [lens: string]: (action?: IxAction<any>) => void } = {};

    private asyncSubject$: Subject<IxAction<any>>;
    private asyncSubscription$: Subscription;

    constructor(
        @Inject(StateObservable) private state$: StateObservable,
        @Inject(ActionsSubject) private actions$: ActionsSubject,
    ) {
        this.asyncSubject$ = new Subject<IxAction<any>>();
        this.asyncSubscription$ = this.asyncSubject$
            .withLatestFrom(
                this.state$,
                (a: IxAction<any>, s: any) => [a, view(a.lens)(s), of(s)
                    .map<any, any>(view(a.lens))
                    .chain(a.update)
                    .reduce((__, o) => o),
                ],
            )
            .mergeMap(([a, s, o]) => (a as IxAction<any>)
                .commit(s, o)
                .catch(err => {
                    console.log("dispatchAsyncIx error", a, err);
                    return Observable.empty();
                })
                .startWith(ixAction(a.lens)(a.type, () => of(o))),
            )
            .subscribe((a: any) => this.actions$.next(a));

        // Cleans up the "SyncTable".
        this.state$
            .debounceTime(1000)
            .throttleTime(1000)
            .subscribe(state => {
                const keys = Object.keys(this.syncTable);
                for (let i = 0, len = keys.length; i < len; i++) {
                    const key = keys[i];
                    const lens = key.split(LENS_DELIMITER) as Lens;
                    if (view(lens)(state) === undefined) {
                        (this.syncTable[key])();
                        delete this.syncTable[key];
                    }
                }
            });
    }

    public dispatchIx <S> (action: IxAction<S>): void {
        if (action !== undefined) {
            this.getSyncDispatcher(action.lens)(action);
        }
    }

    public dispatchAsyncIx <S> (action: IxAction<S>): void {
        if (action !== undefined) {
            this.asyncSubject$.next(action);
        }
    }

    private getSyncDispatcher <S, R> (lens: Lens): (action?: IxAction<R>) => void {

        const key = lens.join(LENS_DELIMITER);
        if (key in this.syncTable === false) {

            const subject = new Subject<IxAction<R>>();
            const subscription = subject
                .withLatestFrom(
                    this.state$,
                    (a, s: S) => [a, view<S, R>(a.lens)(s), of(s)
                        .map(view<S, R>(a.lens))
                        .chain(a.update)
                        .reduce((__, o) => o),
                    ] as [IxAction<R>, R, R],
                )
                .concatMap(([a, s, o]) => a
                    .commit(s, o)
                    .catch(err => {
                        console.log("dispatchIx error", a, err);
                        return Observable.empty();
                    })
                    .startWith(ixAction<R>(a.lens)(a.type, () => of(o))),
                )
                .subscribe((a: any) => this.actions$.next(a));

            this.syncTable[key] = function (action?: IxAction<R>): void {

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
