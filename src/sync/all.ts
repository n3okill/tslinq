export const all = <T>(iterator: Iterator<T>, predicate: (x: T) => boolean): boolean => {
  let current = iterator.next();
  while (current.done !== true) {
    if (!predicate(current.value)) {
      return false;
    }
    current = iterator.next();
  }
  return true;
};
