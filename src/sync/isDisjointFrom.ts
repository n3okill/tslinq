import { validateIterableOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { AllIterable } from "../types/other.ts";

export function isDisjointFrom<T>(
  enumerable: IEnumerable<T>,
  second: Iterable<T>,
): boolean {
  validateIterableOrThrow(second, "second");

  const tempSet = new Set<T>();

  for (const enumVal of enumerable.enumeratorSource) {
    if (tempSet.has(enumVal)) {
      continue;
    }
    tempSet.add(enumVal);
    for (const secVal of second) {
      if (secVal === enumVal) {
        return false;
      }
    }
  }

  return true;
}

export async function isDisjointFromAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  second: AllIterable<T>,
): Promise<boolean> {
  validateIterableOrThrow(second, "second", true);
  const tempSet = new Set<T>();
  for await (const enumVal of enumerable.enumeratorSource) {
    if (tempSet.has(enumVal)) {
      continue;
    }
    tempSet.add(enumVal);
    for await (const secVal of second) {
      if (secVal === enumVal) {
        return false;
      }
    }
  }
  return true;
}
