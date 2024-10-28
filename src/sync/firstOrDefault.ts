import { Helpers } from "../internal";

export const firstOrDefault = <T>(
  iterator: Iterator<T>,
  predicate: (x: T) => boolean = () => true,
  defaultValue?: T,
): T => {
  let value: T | undefined;
  let current = iterator.next();
  while (current.done !== true) {
    value = current.value;
    if (predicate(value)) {
      return value;
    }
    current = iterator.next();
  }
  return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
};
