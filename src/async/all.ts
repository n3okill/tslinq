export const all = async <T>(
  iterator: AsyncIterator<T>,
  predicate: (x: T) => boolean | Promise<boolean>,
): Promise<boolean> => {
  let current = await iterator.next();
  while (current.done !== true) {
    if (!(await predicate(current.value))) {
      return false;
    }
    current = await iterator.next();
  }
  return true;
};
