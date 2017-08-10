
import { IterableX } from "@ngix/ix/iterable";
import { of } from "@ngix/ix/iterable/of";
import { from } from "@ngix/ix/iterable/from";

const DEFAULT_FN: <S, R> (source: Iterable<S>) => IterableX<R> = id => from(id)

/**
 * Bind an array of curried IX operators.
 */
export function bindOf <S, R = S> (
    fn: (source: Iterable<S>) => IterableX<R> = DEFAULT_FN,
    ...fns: Array<(source: Iterable<any>) => IterableX<any>>
) {
    return function (...args: S[]): IterableX<R> {
        return [fn, ...fns].reduce((s, f) => s.chain(ss => f(ss)), of(...args));
    }
}
