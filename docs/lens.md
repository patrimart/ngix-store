
# Lenses

Lenses are simply a way of viewing and modifying immutable data structures.

Viewing the interior values of a data structure is very similar to using `@ngrx/store`'s `select` operator or `rxjs`'s `pluck` operator. The difference is that, with a `lens`, you can also modify those values.

For example:

```ts
import { lens, view, set, del } from "@ngix/store/lens";

const data = {
    foo: {
        bar: "baz"
    }
};

const barLens = lens<string>("foo", "bar");
const barGetter = view(barLens);
const barSetter = set(barLens);
const barDelete = del(barLens);

console.log(barGetter(data)); // Outputs: "baz"
barSetter("newBaz")(data); // Returns new `data` object.
barDelete(data); // Delete the `bar` key and returns new `data` object.
```

Note: The action of setting or deleting in a lens causes a new object/array to be created at each level of the lens. Each new object/array is also frozen with `Object.freeze()`.

Lenses can also be composed from multiple lenses:
```ts
const fooLens = lens("foo");
const barLens = lens("bar");
const fooBarLens = lens(fooLens, barLens);
console.log(fooBarGetter(data)); // Outputs: "baz"
```

### Lens Interfaces

```ts
type Lens = Array<string | number>;
function lens(...props: Lens) => Lens;
function lens(...lenses: Lens[]) => Lens;
function view<S, R = S>(lns: Lens) => (state: S) => R;
function set<S>(lns: Lens) => <R>(val: R) => (state: S) => S;
function over<S>(lns: Lens): <R>(fn: (s: R) => R) => (state: S) => S;
function del<S>(lns: Lens): (state: S) => S;
```
