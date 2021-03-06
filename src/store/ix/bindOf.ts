
import { IterableX } from "@reactivex/ix-ts/iterable";
import { of } from "@reactivex/ix-ts/iterable/of";
import { from } from "@reactivex/ix-ts/iterable/from";

import { IxFunction } from "./interfaces";
import { identity } from "./funcs";


/**
 * Bind an array of curried IX operators.
 */
export function bindOf <S, R = S> (
    fn?: IxFunction<S, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, C = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, C = S, D = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, C = S, D = S, E = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, C = S, D = S, E = S, F = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, A = S, B = S, C = S, D = S, E = S, F = S, G = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, G>,
    fn8: IxFunction<G, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf  <S, A = S, B = S, C = S, D = S, E = S, F = S, G = S, H = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, G>,
    fn8: IxFunction<G, H>,
    fn9: IxFunction<H, R>,
): (...args: S[]) => IterableX<R>;

export function bindOf <S, R = S> (...fns: Array<IxFunction<any, any>>): (...args: S[]) => IterableX<R> {
    fns = fns.length === 0 ? [identity()] : fns;
    return function (...args: S[]): IterableX<R> {
        return fns.reduce((s, f) => s.chain(ss => f(ss)), from(args));
    }
}
