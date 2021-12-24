import { Helpers } from "../internal";

export const elementAtOrDefault = <T>(iterator: Iterator<T>, index: number): T => {
    let value: T | undefined;
    let current = iterator.next();
    while (current.done !== true) {
        value = current.value;
        if (index-- === 0) {
            return value;
        }
        current = iterator.next();
    }
    return Helpers.getDefaultValue(value);
};
