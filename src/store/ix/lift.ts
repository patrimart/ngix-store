
import { IterableX } from "@reactivex/ix-ts/iterable";

import { IxFunction } from "./interfaces";

/**
 * Convert an Ix operator into a curried function.
 */

export function lift <S, R = S> (
    op: (s: Iterable<S>, fn: (s: S) => R) => IterableX<R>
): (fn: (s: S) => R) => IxFunction<S, R>;

export function lift <S, R = S> (
    // tslint:disable-next-line:unified-signatures
    op: (s: Iterable<S>, val: string | number | boolean) => IterableX<R>
): (fn: (s: S) => R) => IxFunction<S, R>;

// export function lift <S, R = S> (
//     op: (s: Iterable<S>, ...args: any[]) => IterableX<R>
// ): (...args: any[]) => IxFunction<S, R>;

export function lift <S, R = S> (
    op: (s: Iterable<S>, ...args: any[]) => IterableX<R>
): (...args: any[]) => IxFunction<S, R> {

    return function (...args: any[]): IxFunction<S, R> {

        return function (source: Iterable<S>): IterableX<R> {
            return op(source, ...args);
        }
    }
}

// export function lift <S, R = S> (
//     op: (s: Iterable<S>, fn: (s: S) => R, ...args: any[]) => IterableX<R>,
//     fn: (s: S) => R,
//     ...args: any[],
// ): IxFunction<S, R>;

// export function lift <S, R = S> (
//     op: (s: Iterable<S>, ...args: any[]) => IterableX<R>,
//     ...args: any[],
// ): IxFunction<S, R> {
//     return (source: Iterable<S>) => op(source, ...args);
// }
