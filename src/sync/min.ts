import { Interfaces, Exceptions } from "../internal";

export const min = (iterator: Iterator<number>, comparer: Interfaces.ICompareTo<number>): number => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = current.value;
  current = iterator.next();
  while (current.done !== true) {
    if (comparer.CompareTo(current.value, result) === -1) {
      result = current.value;
    }
    current = iterator.next();
  }
  return result;
};
