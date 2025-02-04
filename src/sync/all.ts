import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function all<T>(
  enumerable: IEnumerable<T>,
  predicate: (x: T) => boolean,
): boolean {
  validateArgumentOrThrow(predicate, "predicate", "function");
  for (const item of enumerable.enumeratorSource) {
    if (!predicate(item)) {
      return false;
    }
  }

  return true;
}

export async function allAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate: (x: T) => boolean | Promise<boolean>,
): Promise<boolean> {
  validateArgumentOrThrow(predicate, "predicate", "function");
  for await (const item of enumerable.enumeratorSource) {
    if (!(await predicate(item))) {
      return false;
    }
  }
  return true;
}
