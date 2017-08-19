
// import * as Ix from "ix";
// import IterableX = Ix.Iterable;
// import from = Ix.Iterable.from;
import { IterableX } from "ix/iterable";
import { of } from "ix/iterable/of";
import { from } from "ix/iterable/from";
import "ix/add/iterable-operators/chain";

import { IxFunction } from "./interfaces";

const DEFAULT_FN: IxFunction<any, any> = id => from(id);

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
    fns = fns.length === 0 ? [DEFAULT_FN] : fns;
    return function (source: Iterable<S>): IterableX<R> {
        return fns.reduce((s, f) => s.chain(r => f(r)), from(source));
    }
}
