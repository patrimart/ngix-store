
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


// import "ix/add/iterable-operators/map";
// import "ix/add/iterable-operators/chain";
// import "ix/add/iterable-operators/foreach";
// import { map } from "ix/iterable/map";

// const cMap = c<number>(map, (i: any) => i + i);
// const comp = [cMap, cMap, cMap];
// const bound = bindOf(...comp);

// bound(1, 2, 3, 4).forEach(i => console.log(i));

