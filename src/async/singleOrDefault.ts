import { Helpers } from "../internal";

export const singleOrDefault = async <T>(
  iterator: AsyncIterator<T>,
  predicate: (x: T) => boolean | Promise<boolean> = () => true,
  defaultValue?: T,
): Promise<T> => {
  const result = [];
  let value: T | undefined;
  let current = await iterator.next();
  while (current.done !== true) {
    value = current.value;
    if (await predicate(current.value)) {
      result.push(current.value);
    }
    current = await iterator.next();
  }
  if (result.length > 1) {
    throw new Error("More than one element satisfies the condition");
  } else if (result.length === 1) {
    return result[0];
  } else {
    return defaultValue !== undefined ? defaultValue : Helpers.getDefaultValue(value);
  }
};
