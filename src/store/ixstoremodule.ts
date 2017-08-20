
import {
    NgModule,
    ModuleWithProviders,
    InjectionToken,
} from "@angular/core";
import {
    Action,
    ActionReducer,
    ActionReducerMap,
    ActionReducerFactory,
    StoreModule,
} from "@ngrx/store";
import {
    StoreConfig,
} from "@ngrx/store/src/store_module";

import { IX_STORE_PROVIDERS } from "./ixstore";
import { ixMetaReducer } from "./ixreducer";


@NgModule({})
export class IxStoreModule {

    /**
     * @ngix/store alternative to @ngrx/store StoreModule.forRoot.
     * @param initIxState - The initial state for the IxStore.
     * @param [reducers]
     * @param [config]
     */
    public static forRoot <S extends { [key: string]: any }, T, V extends Action = Action> (
        initIxState: S,
        reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
        config?: StoreConfig<T, V>,
    ): ModuleWithProviders {
        // TODO This `reducers` may not be valid.
        const metaReducers = [ ixMetaReducer ].concat(config && config.metaReducers || [] as any);
        const ixReducers = Object.keys(initIxState).reduce(
            (p: any, k: string) => ({ ...p, [k]: (s = initIxState[k]) => s }),
            reducers || {},
        );
        const module = StoreModule.forRoot(ixReducers, Object.assign({}, config, { metaReducers }));
        module.providers = (module.providers || []).concat(IX_STORE_PROVIDERS);
        return module;
    }

    /**
     * @ngix/store alternative to @ngrx/store StoreModule.forFeature.
     * @param initIxState - The initial state for the IxStore.
     * @param [reducers]
     * @param [config]
     */
    static forFeature <S extends { [key: string]: any }, T, V extends Action = Action> (
        initIxState: S,
        reducer?: ActionReducerMap<T, V> | ActionReducer<T, V>,
        config?: StoreConfig<T, V>,
    ): ModuleWithProviders {
        // TODO This `reducer` may not be valid.
        const metaReducers = [ ixMetaReducer ].concat(config && config.metaReducers || [] as any);
        const ixReducers = Object.keys(initIxState).reduce(
            (p: any, k: string) => ({ ...p, [k]: (s = initIxState[k]) => s }),
            reducer || {},
        );
        const module = StoreModule.forFeature("[@ngix/store/feature]", ixReducers, Object.assign({}, config, { metaReducers }));
        module.providers = (module.providers || []).concat(IX_STORE_PROVIDERS);
        return module;
    }
}
