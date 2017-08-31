
# IxActions

The `IxAction` class implements the `@ngrx` `Action` interface. It's purpose is the same: dispatch Actions to modify store state.

However, `IxAction`s differ in a few key areas:

- No `@ngrx` stores. `IxAction`s use Lenses to access state.
- No `@ngrx` reducers. `IxAction`s carry lifted `IxJS` functions to modify state in an `@ngix` MetaReducer. 
- Async updates via `RxJS`.
- Rollback to a previous state (or error state) on async error.


### IxAction Interface

Let's start with the `IxAction` interface:

```ts
type IxFunction<S, R = S> = (source: Iterable<S>) => IterableX<R>;

interface IxAction <S> extends Action {
    readonly type: string;
    readonly lens: Lens;
    readonly update: IxFunction<S>;
    readonly commit: (s: S, o: S) => Observable<IxAction<S>>;
}

function ixAction <S> (lens: Lens) => (
    type: string,
    update: IxFunction<S>,
    commit?: (s: S, o: O) => Observable<IxAction<S>>,
) => IxAction<S>;
```

You can see an `IxAction` in use [here](https://github.com/patrimart/ngix-store/blob/master/src/app/app.component.ts).


#### `lens: Lens`

The `IxAction` uses this Lens to access the data the action is supposed to modify. Like `@ngrx` `Store.select()`.


#### `type: string`

The `type` string is not used in `@ngix`. It may be useful for debugging and/or when using `@ngrx/effects`.


#### `update: IxFunction<S>`

This is a composition of `IxJS` functions that will optimistically modify the store state.


#### `commit: (s: S, o: O) => Observable<IxAction<S>>`

Optional. This function takes the store state and the optimistic state and expects an empty Observable or an Observable with an `IxAction`. This allows you to respond to the success or failure of a backend request by returning:

- An empty Observable for no changes.
- An Observable with an `IxAction` to update the object with the most recent data returned in the request.
- An Observable with an `IxAction` to handle a request failure: revert optimistic state or add an error state.

**Note: This Observable is expected to emit zero or one values before completing.** Anything more can result in unexpected behavior. Good examples are the HTTP requests in `@angular/http`.


### Examples

This example refreshes the data in a `users` array store:

```ts
// Pass in the injected Http resource from the component.
export function refresh (http: Http) {

    return ixAction(lens('users'), 'Refresh Users',
        // Since no optimistic updates, identity() keeps the same state.
        ix.identity(),
        // Next, make a REST request to the server getting a list of users.
        () => http.get('https://site.com/users')
        // On success, simply replace the current list with the new list.
            .map(users => ixAction(lens('users'), 'Refresh Success', ix.constant(users)))
        // On error, in this instance, do nothing.
            .catch(err => empty<IxAction<UsersState>>()),
    );
}
```

This example inserts a new User into the `users` array store:

```ts
export function insert (http: Http, user: User) {

    return ixAction(lens('users'), 'Insert User',
        // Optimistically add the User to the list.
        ix.lift(concat)(user),
        // Next, make a REST request to insert the new User.
        () => http.post('https://site.com/users')
        // On success, do nothing since the User has been added already.
        // Real-world, you'd likely update the new User's ID in the response.
            .map(() => empty<IxAction<UsersState>>())
        // On error, filter out the optimistically added User.
            .catch(err => ixAction(lens('users'), 'Insert User Failure', ix.lift(filter)(u => u.id !== user.id)) ),
    );
}
```
