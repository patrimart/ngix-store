
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


// import "ix/add/iterable-operators/map";
// import "ix/add/iterable-operators/chain";
// import "ix/add/iterable-operators/foreach";
// import { map } from "@ngix/ix/iterable/map";

// import { curry } from "./curry";

// const cMap = curry<number>(map, i => i + i);
// const comp = [cMap, cMap, cMap];
// const bound = bindFrom(...comp);

// from([1, 2, 3, 4])
//     .map(i => i + i)
//     .chain(bound)
//     .forEach(i => console.log(i));
