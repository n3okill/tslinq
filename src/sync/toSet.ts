import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function toSet<T>(enumerable: IEnumerable<T>): Set<T> {
  return new Set(enumerable.enumeratorSource);
}

export async function toSetAsync<T>(
  enumerable: IAsyncEnumerable<T>,
): Promise<Set<T>> {
  const _set = new Set<T>();
  for await (const item of enumerable.enumeratorSource) {
    _set.add(item);
  }
  return _set;
}
