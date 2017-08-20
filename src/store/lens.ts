
/**
 * Lens type for convenience.
 */
export type Lens = Array<string | number>;

/**
 * Create a lens that can set/get into an object. Lens are composable with this function.
 */
export function lens (...props: Lens): Lens;
export function lens (...lenses: Lens[]): Lens;
export function lens (...args: any[]): Lens {

    if (typeof args[0] !== "object") {
        return args.slice(0);
    }
    return args.reduce((p, c) => p.concat(c || []), []);
}

/**
 * Builds a curried function to get the value of the lens focus.
 * Returns `undefined` if the lens does not resolve.
 */
export function view <S, R = S> (lns: Lens): (state: S) => R {

    return function (state: S): R {
        let accState: any = state;
        for (let i = 0, len = lns.length; i < len; i++) {
            const prop = lns[i];
            if (prop in accState === false) {
                return undefined as any;
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
 * If the path to the focus does not exist, a new object/array will be created.
 */
export function over <S> (lns: Lens) {

    return <R>(fn: (s: R) => R) => (state: S): S => {

        const origState: S = Array.isArray(state) ? state.slice(0) : { ...state as any };
        let ms: any = origState;

        for (let i = 0, len = lns.length; i < len; i++) {
            const k = lns[i];
            if (k in ms === false) {
                ms[k] = typeof lns[i + 1] === "number" ? [] : {};
            }
            ms = ms[k] = Object.freeze(len - i - 1 ? Array.isArray(ms[k]) ? ms[k].slice(0) : { ...ms[k] } : fn(ms[k]))
        }

        return Object.freeze(origState);
    }
}

/**
 * Builds a curried function to delete the key at the lens focus.
 * If the path of the lens is not valid, the same state reference is returned.
 */
export function del <S> (lns: Lens) {

    return (state: S): S => {

        const origState: S = Array.isArray(state) ? state.slice(0) : { ...state as any };
        let ms: any = origState;

        for (let i = 0, len = lns.length; i < len; i++) {
            const k = lns[i];
            if (k in ms === false) { return state; }
            if (len - i - 1) {
                ms = ms[k] = Object.freeze(Array.isArray(ms[k]) ? ms[k].slice(0) : { ...ms[k] });
            } else {
                delete ms[k];
            }
        }

        return Object.freeze(origState);
    }
}
