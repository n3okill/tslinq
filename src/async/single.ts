import { Exceptions } from "../internal";

export const single = async <T>(
  iterator: AsyncIterator<T>,
  predicate: (x: T) => boolean | Promise<boolean> = () => true,
): Promise<T> => {
  let current = await iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  const result: Array<T> = [];
  do {
    if (await predicate(current.value)) {
      result.push(current.value);
    }
    current = await iterator.next();
  } while (current.done !== true);
  if (result.length === 1) {
    return result[0];
  } else if (result.length > 1) {
    throw Exceptions.ThrowMoreThanOneElementSatisfiesCondition;
  } else {
    throw Exceptions.ThrowNoElementsSatisfyCondition;
  }
};
