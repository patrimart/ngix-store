
import { IterableX } from "@reactivex/ix-ts/iterable";
import { from } from "@reactivex/ix-ts/iterable/from";
import { of } from "@reactivex/ix-ts/iterable/of";

import { IxFunction } from "./interfaces";

/**
 * Returns an Ix identity function that returns what it's passed.
 */
export function identity <S> (): (source: Iterable<S>) => IterableX<S> {
    return (source: Iterable<S>) => from(source);
}

/**
 * Returns an Ix constant function that always returns to given value.
 */
export function constant <S> (value: S): (_: Iterable<S>) => IterableX<S> {
    return (_: Iterable<S>) => of(value);
}
