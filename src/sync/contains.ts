import { Interfaces } from "../internal";

export const contains = <T>(iterator: Iterator<T>, item: T, comparer: Interfaces.IEqualityComparer<T>): boolean => {
    let current = iterator.next();
    while (current.done !== true) {
        if (comparer.Equals(current.value, item) === true) {
            return true;
        }
        current = iterator.next();
    }
    return false;
};
