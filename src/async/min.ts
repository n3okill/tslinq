import { Interfaces, Exceptions } from "../internal";

export const min = async (
  iterator: AsyncIterator<number>,
  comparer: Interfaces.ICompareTo<number> | Interfaces.IAsyncCompareTo<number>,
): Promise<number> => {
  let current = await iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = current.value;
  current = await iterator.next();
  while (current.done !== true) {
    if ((await comparer.CompareTo(current.value, result)) === -1) {
      result = current.value;
    }
    current = await iterator.next();
  }
  return result;
};
