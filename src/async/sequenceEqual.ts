import { Interfaces } from "../internal";

export const sequenceEqual = async <T>(
  iterator: AsyncIterator<T>,
  second: AsyncIterable<T>,
  comparer: Interfaces.IEqualityComparer<T> | Interfaces.IAsyncEqualityComparer<T>,
): Promise<boolean> => {
  const iterator2 = second[Symbol.asyncIterator]();
  let current1 = await iterator.next();
  let current2 = await iterator2.next();

  while (current1.done !== true && current2.done !== true) {
    if (!(await comparer.Equals(current1.value, current2.value))) {
      return false;
    }
    current1 = await iterator.next();
    current2 = await iterator2.next();
  }

  return current1.done === true && current2.done === true;
};
