import { Exceptions } from "../internal";

export const average = <T>(iterator: Iterator<T>, selector: (x: T) => number): number => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let sum = selector(current.value);
  let count = 1;
  current = iterator.next();
  while (current.done !== true) {
    sum += selector(current.value);
    count++;
    current = iterator.next();
  }
  return sum / count;
};
