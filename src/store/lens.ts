
/**
 * Lens type for convenience.
 */
export type Lens = (string | number)[];

/**
 * Create a lens that can set/get into an object. Lens are composable.
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
 * Builds a curried function to get the value of the lens target.
 */
export function get <S, R = S> (lens: Lens): (state: S) => R | symbol {

    return function (state: S): R | symbol {
        let accState: any = state;
        for (let i = 0, len = lens.length; i < len; i++) {
            const prop = lens[i];
            if (prop in accState === false) {
                return ERR_VAL;
            }
            accState = accState[prop];
        }
        return accState as R;
    }
}

/**
 * Builds a curried function to set a value at the lens target.
 * New objects are created and frozen as the lens walks the object tree.
 */
export function set <S> (lens: Lens) {

    return <R>(val: R) => (state: S): S => {

        const origState: S = Object.freeze(Array.isArray(state) ? state.slice(0) : { ...state as any });
        let ms: any = origState;

        for (let i = 0, len = lens.length; i < len; i++) {
            const k = lens[i];
            ms = ms[k] = Object.freeze(len - i - 1 ? Array.isArray(ms[k]) ? ms[k].slice(0) : { ...ms[k] } : val)
        }

        return origState;
    }
}
