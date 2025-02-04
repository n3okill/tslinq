import { isFunctionType } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

export function count<T>(
  enumerable: IEnumerable<T>,
  predicate?: (x: T) => boolean,
): number {
  if (typeof predicate !== "function") {
    if ("length" in enumerable.enumeratorSource) {
      return enumerable.enumeratorSource.length as number;
    }
    predicate = () => true;
  }
  let count = 0;
  for (const item of enumerable.enumeratorSource) {
    if (predicate(item)) {
      count++;
    }
  }
  return count;
}

export async function countAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<number> {
  if (!isFunctionType(predicate)) {
    if ("length" in enumerable.enumeratorSource) {
      return enumerable.enumeratorSource.length as number;
    }
    predicate = () => true;
  }
  let count = 0;
  for await (const item of enumerable.enumeratorSource) {
    if (await predicate(item)) {
      count++;
    }
  }
  return count;
}
