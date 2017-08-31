
# IxJS

The `IxJS` library is very similar in approach to `RxJS`. The main difference is that `IxJS` work on Iterables and AsyncIterables.

Here's an example from the `IxJS` repo:

```ts
import { from } from "ix/iterable/from";
import "ix/add/iterable/filter";
import "ix/add/iterable-operators/map";
import "ix/add/iterable-operators/filter";
import "ix/add/iterable-operators/foreach";

from([1,2,3,4])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .forEach(x => console.log(`Next ${x}`));

// => Next 4
// => Next 8
```

This library was chosen for its similarity and closeness with `RxJS`. One can only imagine that they will always attempt to compliment each other.


### Helper Libraries

`@ngix` includes some helper functions to make working with `IxJS` for composable.

For example:

```ts
import * as ix from "@ngix/store/ix";

import { map } from "ix/iterable/map";
import { filter } from "ix/iterable/filter";
import { forEach } from "ix/iterable/foreach";

const lfilter = ix.lift(filter)(x => x % 2 === 0);
const lmap = ix.lift(map)(x => x * 2);
const lforEach = ix.lift(forEach)(x => console.log(`Next ${x}`));

const comp = ix.bindFrom(lfilter, lmap, lforEach);

comp([1,2,3,4]);

// => Next 4
// => Next 8
```

If that example doesn't make clear the flexibility using `IxJS` like that allows, it will be demonstrated in our demo apps.


### IxJS Helper Interfaces

```ts

```
