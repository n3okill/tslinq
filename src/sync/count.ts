export const count = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean): number => {
  let count = 0;
  let current = iterator.next();
  while (current.done !== true) {
    if (predicate(current.value) === true) {
      count++;
    }
    current = iterator.next();
  }
  return count;
};
