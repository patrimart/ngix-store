
import { IterableX } from "@reactivex/ix-ts/iterable";
import { of } from "@reactivex/ix-ts/iterable/of";
import { from } from "@reactivex/ix-ts/iterable/from";
import "@reactivex/ix-ts/add/iterable-operators/chain";

import { IxFunction } from "./interfaces";
import { identity } from "./funcs";


/**
 * Bind an array of curried IX operators.
 */
export function bindFrom <S, R = S> (
    fn?: IxFunction<S, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, C = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, C = S, D = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, C = S, D = S, E = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, C = S, D = S, E = S, F = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, R>,
): IxFunction<S, R>

export function bindFrom <S, A = S, B = S, C = S, D = S, E = S, F = S, G = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, G>,
    fn8: IxFunction<G, R>,
): IxFunction<S, R>

export function bindFrom  <S, A = S, B = S, C = S, D = S, E = S, F = S, G = S, H = S, R = S> (
    fn: IxFunction<S, A>,
    fn2: IxFunction<A, B>,
    fn3: IxFunction<B, C>,
    fn4: IxFunction<C, D>,
    fn5: IxFunction<D, E>,
    fn6: IxFunction<E, F>,
    fn7: IxFunction<F, G>,
    fn8: IxFunction<G, H>,
    fn9: IxFunction<H, R>,
): IxFunction<S, R>

export function bindFrom <S, R> (...fns: Array<IxFunction<any, any>>): IxFunction<S, R> {
    fns = fns.length === 0 ? [identity()] : fns;
    return function (source: Iterable<S>): IterableX<R> {
        return fns.reduce((s, f) => s.chain(r => f(r)), from(source));
    }
}
