
# @ngix/store

`@ngix/store` is a companion library for `@ngrx`. It is intended to augment and co-exist with `@ngrx` functionality.


## The Differences

`@ngrx` wonderfully solves the problem of managing state in an Angular application. `@ngix` attempts to extend that library
to allow better handling of live data with optimistic updates/rollback in a more functional approach.

Because `rxjs` is such a core library for using Angular and `@ngrx`, I decided to leverage the new `IxJS` library for
function composition.

There are about three core concepts to understand to use this library:

- Lenses
- IxJS currying and composition
- IxActions


## Documentation

- [Using Lenses](lens.md)
- [IxJS Composition](ixjs.md)
- [IxActions](ixaction.md)


## On the shoulders of giants...

- [@ngrx](https://github.com/ngrx)
- [IxJS](https://github.com/ReactiveX/IxJS)
- [RxJS](https://github.com/ReactiveX/rxjs)
- [Angular](https://angular.io/)
