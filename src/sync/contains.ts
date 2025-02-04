import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function contains<T>(
  enumerable: IEnumerable<T>,
  item: T,
  comparer: EqualityComparer<T> = EqualityComparer.default,
): boolean {
  for (const current of enumerable.enumeratorSource) {
    if (comparer.equals(current, item)) {
      return true;
    }
  }
  return false;
}

export async function containsAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  item: T,
  comparer:
    | EqualityComparerAsync<T>
    | EqualityComparer<T> = EqualityComparerAsync.default,
): Promise<boolean> {
  for await (const current of enumerable.enumeratorSource) {
    if (await comparer.equals(current, item)) {
      return true;
    }
  }
  return false;
}
