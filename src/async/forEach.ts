import { Interfaces, EnumerableAsync } from "../internal";

export const forEach = <T, TResult>(enumerable: EnumerableAsync<T>, action: (x: T) => TResult | Promise<TResult>): Interfaces.IAsyncEnumerable<TResult> => {
    const generator = {
        async *[Symbol.asyncIterator]() {
            const iterator = enumerable[Symbol.asyncIterator]();
            let current = await iterator.next();
            while (current.done !== true) {
                yield action(current.value);
                current = await iterator.next();
            }
        },
    };
    return new EnumerableAsync<TResult>(generator);
};
