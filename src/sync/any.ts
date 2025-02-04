import { isFunctionType } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

export function any<T>(
  enumerable: IEnumerable<T>,
  predicate?: (x: T) => boolean,
): boolean {
  if (typeof predicate !== "function") {
    return !enumerable.iterator().next().done;
  }
  for (const item of enumerable.enumeratorSource) {
    if (predicate(item)) {
      return true;
    }
  }

  return false;
}

export async function anyAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<boolean> {
  if (!isFunctionType(predicate)) {
    return !(await enumerable.iterator().next()).done;
  }
  for await (const item of enumerable.enumeratorSource) {
    if (await predicate(item)) {
      return true;
    }
  }
  return false;
}
