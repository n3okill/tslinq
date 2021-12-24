import { Interfaces, Enumerable } from "../internal";

export const forEach = <T, TResult>(enumerable: Enumerable<T>, action: (x: T) => TResult): Interfaces.IEnumerable<TResult> => {
    const generator = {
        *[Symbol.iterator]() {
            const iterator = enumerable[Symbol.iterator]();
            let current = iterator.next();
            while (current.done !== true) {
                yield action(current.value);
                current = iterator.next();
            }
        },
    };
    return new Enumerable<TResult>(generator);
};
