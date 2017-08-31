
import { IterableX } from "@reactivex/ix-ts/iterable";

export type IxFunction<S, R = S> = (source: Iterable<S>) => IterableX<R>;
