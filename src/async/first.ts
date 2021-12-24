import { Exceptions } from "../internal";

export const first = async <T>(iterator: AsyncIterator<T>, predicate: (x: T) => boolean | Promise<boolean> = () => true): Promise<T> => {
    let current = await iterator.next();
    if (current.done) {
        throw Exceptions.ThrowNoElementsException;
    }

    do {
        if (await predicate(current.value)) {
            return current.value;
        }
        current = await iterator.next();
    } while (current.done !== true);

    throw Exceptions.ThrowNoElementsSatisfyCondition;
};
