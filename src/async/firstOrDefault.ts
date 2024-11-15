import { Helpers } from "../internal";

export const firstOrDefault = async <T>(
  iterator: AsyncIterator<T>,
  predicate: (x: T) => boolean | Promise<boolean> = () => true,
  defaultValue?: T,
): Promise<T> => {
  let value: T | undefined;
  let current = await iterator.next();
  while (current.done !== true) {
    value = current.value;
    if (await predicate(value)) {
      return value;
    }
    current = await iterator.next();
  }
  return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
};
