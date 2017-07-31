
import { IterableX } from "ix/iterable";

/**
 * Convert an Ix operator into a curried function.
 */
export function c <S, R = S> (op: (s: Iterable<S>, ...args: any[]) => IterableX<R>, ...args: any[]) {

    return (source: Iterable<S>) => op(source, ...args);
}
