import { Helpers } from "../internal";

export const lastOrDefault = <T>(
  iterator: Iterator<T>,
  predicate: (x: T) => boolean = () => true,
  defaultValue?: T,
): T => {
  let result: T | undefined;
  let value: T | undefined;
  let current = iterator.next();
  while (current.done !== true) {
    value = current.value;
    if (predicate(value)) {
      result = value;
    }
    current = iterator.next();
  }

  if (result) {
    return result;
  }
  return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
};
