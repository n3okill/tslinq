import { isFunctionType } from "../utils";

export const any = async <T>(
  iterator: AsyncIterator<T>,
  predicate?: (x: T) => boolean | Promise<boolean>,
): Promise<boolean> => {
  let current = await iterator.next();
  if (!isFunctionType(predicate)) {
    return !current.done;
  }
  while (current.done !== true) {
    if (await (predicate as CallableFunction)(current.value)) {
      return true;
    }
    current = await iterator.next();
  }
  return false;
};
