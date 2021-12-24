import { Helpers } from "../internal";

export const elementAtOrDefault = async <T>(iterator: AsyncIterator<T>, index: number): Promise<T> => {
    let value: T | undefined;
    let current = await iterator.next();
    while (current.done !== true) {
        value = current.value;
        if (index-- === 0) {
            return value;
        }
        current = await iterator.next();
    }
    return Helpers.getDefaultValue(value);
};
