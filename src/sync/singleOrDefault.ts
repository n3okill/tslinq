import { Helpers } from "../internal";

export const singleOrDefault = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean = () => true, defaultValue?: T): T => {
    const result = [];
    let value: T | undefined;
    let current = iterator.next();
    while (current.done !== true) {
        value = current.value;
        if (predicate(current.value)) {
            result.push(current.value);
        }
        current = iterator.next();
    }
    if (result.length > 1) {
        throw new Error("More than one element satisfies the condition");
    } else if (result.length === 1) {
        return result[0];
    } else {
        return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
    }
};
