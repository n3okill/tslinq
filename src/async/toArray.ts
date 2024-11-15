import { EnumerableAsync, Enumerable } from "../internal";

export const toArray = async <T>(iterator: AsyncIterator<T>): Promise<Array<T>> => {
  const result = [];
  let current = await iterator.next();
  while (current.done !== true) {
    if (current.value instanceof EnumerableAsync) {
      result.push((await current.value.toArray()) as unknown as T);
    } else if (current.value instanceof Enumerable) {
      result.push(current.value.toArray() as unknown as T);
    } else {
      result.push(current.value);
    }
    current = await iterator.next();
  }
  return result;
};
