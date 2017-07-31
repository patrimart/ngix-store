
import { Operator }                from "rxjs/Operator";
import { Subscriber }              from "rxjs/Subscriber";
import { ArgumentOutOfRangeError } from "rxjs/util/ArgumentOutOfRangeError";
import { EmptyObservable }         from "rxjs/observable/EmptyObservable";
import { Observable }              from "rxjs/Observable";
import { TeardownLogic }           from "rxjs/Subscription";

/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
export function lens <T, U> (this: Observable<T>, ...props: (string | number)[]): Observable<U> {

    if (props.length === 0) {
        return new EmptyObservable<U>();
    }
    return this.lift(new LensOperator(props));
}

class LensOperator <T, U> implements Operator <T, U> {

    constructor (private props: (string | number)[]) {}

    public call (subscriber: Subscriber<U>, source: Observable<T>): TeardownLogic {
        return source.subscribe(new LensSubscriber(subscriber, this.props));
    }
}

class LensSubscriber <T, U> extends Subscriber <T> {

    private vq: (state: T) => U | symbol;

    constructor (protected destination: Subscriber<U>, private props: (string | number)[]) {
        super(destination);
        this.vq = valQuery(props);
    }

    protected _next (value: T): void {

        const valueU = this.vq(value);
        if (valueU === ERR_VAL) {
            this.destination.error(new Error(`The path "${this.props.join(".")}" is no longer valid.`));
        } else {
            this.destination.next(valueU as U);
        }
    }
}

const ERR_VAL = Symbol();

function valQuery <T, U> (props: (string | number)[]): (state: T) => U | symbol {

    return function (state: T): U | symbol {
        let accState: any = state;
        for (let i = 0, len = props.length; i < len; i++) {
            const prop = props[i];
            if (prop in accState === false) {
                return ERR_VAL;
            }
            accState = accState[prop];
        }
        return accState;
    }
}
