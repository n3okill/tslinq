import { NoElementsException } from "../exceptions/NoElementsException.ts";
import { NoElementsSatisfyCondition } from "../exceptions/NoElementsSatisfyCondition.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { isUndefined } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

export function first<T>(
  enumerable: IEnumerable<T>,
  predicate?: (x: T) => boolean,
): T {
  if (!isUndefined(predicate)) {
    validateArgumentOrThrow(predicate, "predicate", "function");
  }
  const iterator = enumerable.iterator();
  let current = iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  if (!predicate) {
    return current.value;
  }

  do {
    if (predicate(current.value)) {
      return current.value;
    }
    current = iterator.next();
  } while (current.done !== true);

  throw new NoElementsSatisfyCondition();
}

export async function firstAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  if (!isUndefined(predicate)) {
    validateArgumentOrThrow(predicate, "predicate", "function");
  }
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  if (!predicate) {
    return current.value;
  }

  do {
    if (await predicate(current.value)) {
      return current.value;
    }
    current = await iterator.next();
  } while (current.done !== true);

  throw new NoElementsSatisfyCondition();
}
