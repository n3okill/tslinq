import { Interfaces, Enumerable } from "../internal";

export const chunk = <T>(iterator: Iterator<T>, size: number): Interfaces.IEnumerable<Array<T>> => {
  if (size < 0) {
    throw new RangeError("'index' is out of range");
  }
  function* generator(iterator: Iterator<T>) {
    let current = iterator.next();
    while (current.done !== true) {
      const chunk = [current.value];
      let i = 1;
      current = iterator.next();
      while (current.done !== true && i < size) {
        chunk.push(current.value);
        i++;
        current = iterator.next();
      }
      yield chunk;
    }
  }
  return new Enumerable<Array<T>>(generator(iterator));
};
