import { Exceptions } from "../internal";

export const average = async <T>(iterator: AsyncIterator<T>, selector: (x: T) => number | Promise<number>): Promise<number> => {
    let current = await iterator.next();
    if (current.done) {
        throw Exceptions.ThrowNoElementsException;
    }
    let sum = await selector(current.value);
    let count = 1;
    current = await iterator.next();
    while (current.done !== true) {
        sum += await selector(current.value);
        count++;
        current = await iterator.next();
    }
    return sum / count;
};
