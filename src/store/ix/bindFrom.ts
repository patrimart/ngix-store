
import { IterableX } from "@ngix/ix/iterable";
import { from } from "@ngix/ix/iterable/from";
import { of } from "@ngix/ix/iterable/of";
import "@ngix/ix/add/iterable-operators/chain";

const DEFAULT_FN: <S, R> (source: Iterable<S>) => IterableX<R> = id => from(id);

/**
 * Bind an array of curried IX operators.
 */
export function bindFrom <S, R> (
    fn: (source: Iterable<S>) => IterableX<R> = DEFAULT_FN,
    ...fns: Array<(source: Iterable<any>) => IterableX<any>>
) {
    return function (source: Iterable<S>): IterableX<R> {
        return [fn, ...fns].reduce((s, f) => s.chain(ss => f(ss)), from(source));
    }
}
