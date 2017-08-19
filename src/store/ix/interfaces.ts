
import * as Ix from "ix";
import IterableX = Ix.Iterable;

// import { IterableX } from "ix/iterable";

export type IxFunction<S, R = S> = (source: Iterable<S>) => IterableX<R>;
