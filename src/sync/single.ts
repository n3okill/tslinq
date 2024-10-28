import { Exceptions } from "../internal";

export const single = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean = () => true): T => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  const result: Array<T> = [];
  do {
    if (predicate(current.value)) {
      result.push(current.value);
    }
    current = iterator.next();
  } while (current.done !== true);
  if (result.length === 1) {
    return result[0];
  } else if (result.length > 1) {
    throw Exceptions.ThrowMoreThanOneElementSatisfiesCondition;
  } else {
    throw Exceptions.ThrowNoElementsSatisfyCondition;
  }
};
