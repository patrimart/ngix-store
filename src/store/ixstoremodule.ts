
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

import { IX_STORE_PROVIDERS } from "../store/ixstore";
import { createIxReducer } from "./ixreducer";


@NgModule({})
export class IxStoreModule {

    public static forRoot <T, V extends Action = Action> (
        reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
        config: StoreConfig<T, V> = {},
    ): ModuleWithProviders {
        // TODO This `reducers` may not be valid.
        const module = StoreModule.forRoot({ ...createIxReducer({ counter: 0 }), ...reducers as any }, config);
        module.providers = (module.providers || []).concat(IX_STORE_PROVIDERS);
        return module;
    }


    static forFeature <T, V extends Action = Action> (
        featureName: string,
        reducer?: ActionReducerMap<T, V> | ActionReducer<T, V>,
        config: StoreConfig<T, V> = {},
    ): ModuleWithProviders {
        // TODO This `reducer` may not be valid.
        const module = StoreModule.forFeature(featureName, { ...createIxReducer({ counter: 0 }), ...reducer as any }, config);
        module.providers = (module.providers || []).concat(IX_STORE_PROVIDERS);
        return module;
    }
}
