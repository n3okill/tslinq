import { Exceptions } from "../internal";

export const last = async <T>(iterator: AsyncIterator<T>, predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<T> => {
    let current = await iterator.next();
    if (current.done) {
        throw Exceptions.ThrowNoElementsException;
    }
    let result: T | undefined;

    do {
        if (await predicate(current.value)) {
            result = current.value;
        }
        current = await iterator.next();
    } while (current.done !== true);

    if (result) {
        return result;
    }
    throw Exceptions.ThrowNoElementsSatisfyCondition;
};
