
import { set } from "./lens";

import { IxAction, ACTION } from "./models";


export function ixReducer (state: object, action: IxAction<any, any>) {

    switch (action.type.startsWith(ACTION)) {

        case true:
            return set(action.lens)(action.transformer().reduce((_, s) => s))(state);

        default:
            return state;
    }
}
