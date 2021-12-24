import { Interfaces, EnumerableAsync } from "../internal";

// eslint-disable-next-line @typescript-eslint/require-await
export const chunk = <T>(iterator: AsyncIterator<T>, size: number): Interfaces.IAsyncEnumerable<Array<T>> => {
    if (size < 0) {
        throw new RangeError("'index' is out of range");
    }
    async function* generator(iterator: AsyncIterator<T>) {
        let current = await iterator.next();
        while (current.done !== true) {
            const chunk = [current.value];
            let i = 1;
            current = await iterator.next();
            while (current.done !== true && i < size) {
                chunk.push(current.value);
                i++;
                current = await iterator.next();
            }
            yield chunk;
        }
    }
    return new EnumerableAsync<Array<T>>(generator(iterator));
};
