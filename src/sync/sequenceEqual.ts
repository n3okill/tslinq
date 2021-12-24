import { Interfaces } from "../internal";

export const sequenceEqual = <T>(iterator: Iterator<T>, second: Iterable<T>, comparer: Interfaces.IEqualityComparer<T>): boolean => {
    const iterator2 = second[Symbol.iterator]();
    let current1 = iterator.next();
    let current2 = iterator2.next();

    while (current1.done !== true && current2.done !== true) {
        if (!comparer.Equals(current1.value, current2.value)) {
            return false;
        }
        current1 = iterator.next();
        current2 = iterator2.next();
    }

    return current1.done === true && current2.done === true;
};
