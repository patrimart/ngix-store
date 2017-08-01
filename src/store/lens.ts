
/**
 * Lens type for convenience.
 */
export type Lens = (string | number)[];

/**
 * Create a lens that can set/get into an object. Lens are composable with this function.
 */
export function lens (...props: (string | number)[]): Lens;
// tslint:disable-next-line:unified-signatures
export function lens (...lenses: Lens[]): Lens;
export function lens (...args: any[]): Lens {

    if (typeof args[0] !== "object") {
        return args.slice(0);
    }
    return args.reduce((p, c) => p.concat(c || []), []);
}


export const ERR_VAL = Symbol();

/**
 * Builds a curried function to get the value of the lens focus.
 */
export function view <S, R = S> (lns: Lens): (state: S) => R | symbol {

    return function (state: S): R | symbol {
        let accState: any = state;
        for (let i = 0, len = lns.length; i < len; i++) {
            const prop = lns[i];
            if (prop in accState === false) {
                return ERR_VAL;
            }
            accState = accState[prop];
        }
        return accState as R;
    }
}

/**
 * Builds a curried function to set a value at the lens focus.
 * New objects are created and frozen as the lens walks the object tree.
 * If the path to the focus does not exist, that same state reference will be returned.
 */
export function set <S> (lns: Lens): <R>(val: R) => (state: S) => S {

    return <R>(val: R) => over<S>(lns)(_ => val)
}

/**
 * Builds a curried function to map a value at the lens focus.
 * New objects are created and frozen as the lens walks the object tree.
 * If the path to the focus does not exist, that same state reference will be returned.
 */
export function over <S> (lns: Lens) {

    return <R>(fn: (s: R) => R) => (state: S): S => {

        const origState: S = Object.freeze(Array.isArray(state) ? state.slice(0) : { ...state as any });
        let ms: any = origState;

        for (let i = 0, len = lns.length; i < len; i++) {
            const k = lns[i];
            if (k in ms === false) { return state; }
            ms = ms[k] = Object.freeze(len - i - 1 ? Array.isArray(ms[k]) ? ms[k].slice(0) : { ...ms[k] } : fn(ms[k]))
        }

        return origState;
    }
}
