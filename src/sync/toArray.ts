import { Enumerable } from "../internal";

export const toArray = <T>(iterator: Iterator<T>): Array<T> => {
  const result = [];
  let current = iterator.next();
  while (current.done !== true) {
    if (current.value instanceof Enumerable) {
      result.push(current.value.toArray() as unknown as T);
    } else {
      result.push(current.value);
    }
    current = iterator.next();
  }
  return result;
};
