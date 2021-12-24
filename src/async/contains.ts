import { Interfaces } from "../internal";

export const contains = async <T>(iterator: AsyncIterator<T>, item: T, comparer: Interfaces.IEqualityComparer<T> | Interfaces.IAsyncEqualityComparer<T>): Promise<boolean> => {
    let current = await iterator.next();
    while (current.done !== true) {
        if ((await comparer.Equals(current.value, item)) === true) {
            return true;
        }
        current = await iterator.next();
    }
    return false;
};
