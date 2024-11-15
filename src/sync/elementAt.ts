export const elementAt = <T>(iterator: Iterator<T>, index: number): T => {
  if (index < 0) {
    throw new RangeError("'index' is out of range");
  }
  let current = iterator.next();
  while (current.done !== true) {
    if (index-- === 0) {
      return current.value;
    }
    current = iterator.next();
  }
  throw new RangeError("'index' is out of range");
};
