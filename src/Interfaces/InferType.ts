import { IConstructor } from "./IConstructor";

/**
 * Accepted inputs for the ofType function
 */
export type OfType = "object" | "function" | "symbol" | "boolean" | "number" | "string" | IConstructor<unknown>;

/**
 * Determines the return type based on the input type T.
 * @see {OfType}
 */
export type InferType<T> =
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends "object"
        ? object
        : T extends "function"
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          Function
        : T extends "symbol"
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          Symbol
        : T extends "boolean"
        ? boolean
        : T extends "number"
        ? number
        : T extends "string"
        ? string
        : T extends IConstructor<infer TResult>
        ? TResult
        : never;
