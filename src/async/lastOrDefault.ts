import { Helpers } from "../internal";

export const lastOrDefault = async <T>(
  iterator: AsyncIterator<T>,
  predicate: (x: T) => boolean | Promise<boolean> = () => true,
  defaultValue?: T,
): Promise<T> => {
  let result: T | undefined;
  let value: T | undefined;
  let current = await iterator.next();
  while (current.done !== true) {
    value = current.value;
    if (await predicate(value)) {
      result = value;
    }
    current = await iterator.next();
  }

  if (result) {
    return result;
  }
  return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
};
