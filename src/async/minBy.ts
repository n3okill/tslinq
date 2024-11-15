import { Interfaces, Exceptions, Types } from "../internal";

export const minBy = async <T, TKey>(
  iterator: AsyncIterator<T>,
  keySelector: Types.TKeySelectorAsync<T, TKey> = (x) => x as unknown as TKey,
  comparer: Interfaces.ICompareTo<TKey> | Interfaces.IAsyncCompareTo<TKey>,
): Promise<T> => {
  let current = await iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = current.value;
  let key = await keySelector(result);
  current = await iterator.next();
  while (current.done !== true) {
    const nextValue = current.value;
    const nextKey = await keySelector(nextValue);
    if ((await comparer.CompareTo(nextKey, key)) < 0) {
      result = nextValue;
      key = nextKey;
    }
    current = await iterator.next();
  }
  return result;
};
