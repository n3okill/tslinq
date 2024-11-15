import { Exceptions } from "../internal";

export const last = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean = () => true): T => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result: T | undefined;

  do {
    if (predicate(current.value)) {
      result = current.value;
    }
    current = iterator.next();
  } while (current.done !== true);

  if (result) {
    return result;
  }
  throw Exceptions.ThrowNoElementsSatisfyCondition;
};
