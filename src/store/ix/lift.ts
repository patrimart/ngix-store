
import { IterableX } from "@ngix/ix/iterable";

/**
 * Convert an Ix operator into a curried function.
 */
export function lift <S, R = S> (
    op: (s: Iterable<S>, fn: (s: S) => R, ...args: any[]) => IterableX<R>,
    fn: (s: S) => R,
    ...args: any[],
): (s: Iterable<S>) => IterableX<R>;
export function lift <S, R = S> (
    op: (s: Iterable<S>, ...args: any[]) => IterableX<R>,
    ...args: any[],
): (s: Iterable<S>) => IterableX<R> {

    return (source: Iterable<S>) => op(source, ...args);
}
