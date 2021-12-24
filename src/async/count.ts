export const count = async <T>(iterator: AsyncIterator<T>, predicate: (x: T) => boolean | Promise<boolean>): Promise<number> => {
    let count = 0;
    let current = await iterator.next();
    while (current.done !== true) {
        if ((await predicate(current.value)) === true) {
            count++;
        }
        current = await iterator.next();
    }
    return count;
};
