import { Exceptions } from "../internal";

export const first = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean = () => true): T => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }

  do {
    if (predicate(current.value)) {
      return current.value;
    }
    current = iterator.next();
  } while (current.done !== true);

  throw Exceptions.ThrowNoElementsSatisfyCondition;
};
