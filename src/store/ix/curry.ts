
import { IterableX } from "@ngix/ix/iterable";

/**
 * Convert an Ix operator into a curried function.
 */
export function curry <S, R = S> (op: (s: Iterable<S>, ...args: any[]) => IterableX<R>, ...args: any[]) {

    return (source: Iterable<S>) => op(source, ...args);
}
