import { NoElementsException } from "../exceptions/NoElementsException.ts";
import { NoElementsSatisfyCondition } from "../exceptions/NoElementsSatisfyCondition.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import { isNullOrUndefined, isUndefined } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

export function last<T>(
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

  if (Array.isArray(enumerable.enumeratorSource)) {
    if (isUndefined(predicate)) {
      return enumerable.enumeratorSource[
        enumerable.enumeratorSource.length - 1
      ];
    }
    let index = enumerable.enumeratorSource.length;
    while (index--) {
      if (predicate(enumerable.enumeratorSource.at(index))) {
        return enumerable.enumeratorSource.at(index);
      }
    }
  } else {
    let result: T | undefined;
    if (isUndefined(predicate)) {
      do {
        result = current.value;
        current = iterator.next();
      } while (current.done !== true);
      return result;
    } else {
      while (current.done !== true) {
        if (predicate(current.value)) {
          result = current.value;
          while (current.done !== true) {
            if (predicate(current.value)) {
              result = current.value;
            }
            current = iterator.next();
          }
          return result;
        }
        current = iterator.next();
      }
    }
  }
  throw new NoElementsSatisfyCondition();
}

export async function lastAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  if (!isNullOrUndefined(predicate)) {
    validateArgumentOrThrow(predicate, "predicate", "function");
  }

  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }

  if (Array.isArray(enumerable.enumeratorSource)) {
    if (isUndefined(predicate)) {
      return enumerable.enumeratorSource[
        enumerable.enumeratorSource.length - 1
      ];
    }
    let index = enumerable.enumeratorSource.length;
    while (index--) {
      if (await predicate(enumerable.enumeratorSource.at(index))) {
        return enumerable.enumeratorSource.at(index);
      }
    }
  } else {
    let result: T | undefined;
    if (isUndefined(predicate)) {
      do {
        result = current.value;
        current = await iterator.next();
      } while (current.done !== true);
      return result;
    } else {
      while (current.done !== true) {
        if (await predicate(current.value)) {
          result = current.value;
          while (current.done !== true) {
            if (await predicate(current.value)) {
              result = current.value;
            }
            current = await iterator.next();
          }
          return result;
        }
        current = await iterator.next();
      }
    }
  }
  throw new NoElementsSatisfyCondition();
}
