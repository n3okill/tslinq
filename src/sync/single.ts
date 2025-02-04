import type { IEnumerable } from "../types/enumerable.interface.ts";
import { MoreThanOneElementSatisfiesCondition } from "../exceptions/MoreThanOneElementSatisfiesCondition.ts";
import { NoElementsException } from "../exceptions/NoElementsException.ts";
import { NoElementsSatisfyCondition } from "../exceptions/NoElementsSatisfyCondition.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";
import { isUndefined } from "../helpers/utils.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

export function single<T>(
  enumerable: IEnumerable<T>,
  predicate?: (x: T) => boolean,
): T {
  const iterator = enumerable.iterator();
  let current = iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  //const result: Array<T> = [];
  let result: T;
  if (!isUndefined(predicate)) {
    validateArgumentOrThrow(predicate, "predicate", "function");
    do {
      if (predicate(current.value)) {
        result = current.value;
        current = iterator.next();
        while (current.done !== true) {
          if (predicate(current.value)) {
            throw new MoreThanOneElementSatisfiesCondition();
          }
          current = iterator.next();
        }
        return result;
      }
      current = iterator.next();
    } while (current.done !== true);
  } else {
    result = current.value;
    current = iterator.next();
    if (!current.done) {
      throw new MoreThanOneElementSatisfiesCondition();
    }
    return result;
  }

  throw new NoElementsSatisfyCondition();
}

export async function singleAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }

  let result: T;
  if (!isUndefined(predicate)) {
    validateArgumentOrThrow(predicate, "predicate", "function");
    do {
      if (await predicate(current.value)) {
        result = current.value;
        current = await iterator.next();
        while (current.done !== true) {
          if (await predicate(current.value)) {
            throw new MoreThanOneElementSatisfiesCondition();
          }
          current = await iterator.next();
        }
        return result;
      }
      current = await iterator.next();
    } while (current.done !== true);
  } else {
    result = current.value;
    current = await iterator.next();
    if (!current.done) {
      throw new MoreThanOneElementSatisfiesCondition();
    }
    return result;
  }

  throw new NoElementsSatisfyCondition();
}
