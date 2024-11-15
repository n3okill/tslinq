import { Interfaces, Exceptions, Types } from "../internal";

export const minBy = <T, TKey>(
  iterator: Iterator<T>,
  keySelector: Types.TKeySelector<T, TKey>,
  comparer: Interfaces.ICompareTo<TKey>,
): T => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = current.value;
  let key = keySelector(result);
  current = iterator.next();
  while (current.done !== true) {
    const nextValue = current.value;
    const nextKey = keySelector(nextValue);
    if (comparer.CompareTo(nextKey, key) < 0) {
      key = nextKey;
      result = nextValue;
    }
    current = iterator.next();
  }
  return result;
};
