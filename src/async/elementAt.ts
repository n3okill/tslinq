export const elementAt = async <T>(iterator: AsyncIterator<T>, index: number): Promise<T> => {
  if (index < 0) {
    throw new RangeError("'index' is out of range");
  }
  let current = await iterator.next();
  while (current.done !== true) {
    if (index-- === 0) {
      return current.value;
    }
    current = await iterator.next();
  }
  throw new RangeError("'index' is out of range");
};
