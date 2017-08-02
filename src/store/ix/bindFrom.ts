
import { IterableX } from "@ngix/ix/iterable";
import { from } from "@ngix/ix/iterable/from";
import "@ngix/ix/add/iterable-operators/chain";

/**
 * Bind an array of curried IX operators.
 */
export function bindFrom <S, R> (
    fn: (source: Iterable<any>) => IterableX<R> = id => id as any,
    ...fns: Array<(source: Iterable<any>) => IterableX<any>>
) {
    return function (source: Iterable<S>): IterableX<R> {
        return [fn, ...fns].reduce((s, f) => s.chain(ss => f(ss)), from(source));
    }
}


// import "ix/add/iterable-operators/map";
// import "ix/add/iterable-operators/chain";
// import "ix/add/iterable-operators/foreach";
// import { map } from "ix/iterable/map";

// const cMap = c<number>(map, (i: any) => i + i);
// const comp = [cMap, cMap, cMap];
// const bound = bindFrom(...comp);

// from([1, 2, 3, 4])
//     .map(i => i + i)
//     .chain(bound)
//     .forEach(i => console.log(i));
