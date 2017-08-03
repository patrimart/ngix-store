
import { set } from "./lens";
import { of } from "@ngix/ix/iterable/of";

import { IxAction, ACTION } from "./models";


export const IX_REDUCER_NAME = "[@ngix/store]";

export function createIxReducer (initState: any) {

    return { [IX_REDUCER_NAME]: function ixReducer (state= initState, action: IxAction<any, any>) {

        switch (action.type.startsWith(ACTION)) {

            case true:
                return set(action.lens)(action.transformer(of(state)).reduce((_, s) => s))(state);

            default:
                return state;
        }
    }}
}
