import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function toArray<T>(enumerable: IEnumerable<T>): Array<T> {
  if (Array.isArray(enumerable.enumeratorSource)) {
    return enumerable.enumeratorSource;
  }

  const result = [];
  const iterator = enumerable.iterator();
  let current = iterator.next();
  while (current.done !== true) {
    if (current.value instanceof Enumerable) {
      result.push(current.value.toArray() as unknown as T);
    } else {
      result.push(current.value);
    }
    current = iterator.next();
  }
  return result;
}

export async function toArrayAsync<T>(
  enumerable: IAsyncEnumerable<T>,
): Promise<Array<T>> {
  const result = [];
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  while (current.done !== true) {
    if (current.value instanceof AsyncEnumerable) {
      result.push((await current.value.toArray()) as unknown as T);
    } else if (current.value instanceof Enumerable) {
      result.push(current.value.toArray() as unknown as T);
    } else {
      result.push(current.value);
    }
    current = await iterator.next();
  }
  return result;
}
