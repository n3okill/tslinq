import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TKeySelectorAsync } from "../types/selectors.ts";

export function toMap<T, TKey>(
  enumerable: IEnumerable<T>,
  keySelector: (x: T) => TKey,
): Map<TKey, Array<T>> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  const iterator = enumerable.iterator();
  const map = new Map<TKey, Array<T>>();
  let current = iterator.next();
  while (current.done !== true) {
    const key = keySelector(current.value);
    if (map.has(key)) {
      map.get(key)?.push(current.value);
    } else {
      map.set(key, [current.value]);
    }
    current = iterator.next();
  }
  return map;
}

export async function toMapAsync<T, TKey>(
  enumerable: IAsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
): Promise<Map<TKey, Array<T>>> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  const iterator = enumerable.iterator();
  const map = new Map<TKey, Array<T>>();
  let current = await iterator.next();
  while (current.done !== true) {
    const key = await keySelector(current.value);
    if (map.has(key)) {
      map.get(key)?.push(current.value);
    } else {
      map.set(key, [current.value]);
    }
    current = await iterator.next();
  }
  return map;
}
