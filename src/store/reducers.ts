
// import { IterableX } from "ix/iterable";
// import { of } from "ix/iterable/of";
// import "ix/add/iterable-operators/map";
// import "ix/add/iterable-operators/chain";
// import "ix/add/iterable-operators/catch";
// import "ix/add/iterable-operators/foreach";
// import { map } from "ix/iterable/map";

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
