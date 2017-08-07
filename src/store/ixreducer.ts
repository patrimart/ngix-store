
import { Action, ActionReducer } from "@ngrx/store";

import { set } from "./lens";
import { of } from "@ngix/ix/iterable/of";

import { IxAction, ACTION } from "./models";


export function ixMetaReducer <T, V extends Action = Action> (reducer: ActionReducer<T, V>) {

    return function <R> (state: T, action: IxAction<T, R>) {

        if (state !== undefined && "lens" in action) {
            state = set<T>(action.lens)(action.update(of(state)).reduce((_, s) => s))(state);
        }

        return reducer(state, action as any);
    }
}
