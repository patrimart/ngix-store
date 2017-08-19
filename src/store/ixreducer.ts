
import { Action, ActionReducer } from "@ngrx/store";

import * as Ix from "ix";
import of = Ix.Iterable.of;
// import { of } from "ix/iterable/of";

import { set, view } from "./lens";

import { IxAction, ACTION } from "./models";


export function ixMetaReducer <T, V extends Action = Action> (reducer: ActionReducer<T, V>) {

    return function <R> (state: T, action: IxAction<R>) {

        if (state !== undefined && "lens" in action) {
            state = set<T>(action.lens)(action.update(of(view<T, R>(action.lens)(state))).reduce((_, s) => s))(state);
        }

        return reducer(state, action as any);
    }
}
