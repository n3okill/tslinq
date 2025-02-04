import type { IEnumerable } from "../types/enumerable.interface.ts";
import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../comparer/equality-comparer.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { AllIterable } from "../types/other.ts";
import { isIterable } from "../helpers/utils.ts";
import { validateIterableOrThrow } from "../helpers/helpers.ts";

export function sequenceEqual<T>(
  enumerable: IEnumerable<T>,
  second: Iterable<T>,
  comparer?: EqualityComparer<T>,
): boolean {
  validateIterableOrThrow(second, "second");
  const iterator = enumerable.iterator();
  const iterator2 = second[Symbol.iterator]();
  let current1 = iterator.next();
  let current2 = iterator2.next();

  if (typeof comparer !== "undefined") {
    while (current1.done !== true && current2.done !== true) {
      if (!comparer.equals(current1.value, current2.value)) {
        return false;
      }
      current1 = iterator.next();
      current2 = iterator2.next();
    }
  } else {
    while (current1.done !== true && current2.done !== true) {
      if (current1.value !== current2.value) {
        return false;
      }
      current1 = iterator.next();
      current2 = iterator2.next();
    }
  }

  return current1.done === true && current2.done === true;
}

export async function sequenceEqualAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  second: AllIterable<T>,
  comparer: EqualityComparerAsync<T> = EqualityComparerAsync.default,
): Promise<boolean> {
  validateIterableOrThrow(second, "second", true);
  const iterator = enumerable.iterator();
  const iterator2 = isIterable(second)
    ? second[Symbol.iterator]()
    : second[Symbol.asyncIterator]();
  let current1 = await iterator.next();
  let current2 = await iterator2.next();

  if (comparer !== EqualityComparerAsync.default) {
    while (current1.done !== true && current2.done !== true) {
      if (!(await comparer.equals(current1.value, current2.value))) {
        return false;
      }
      current1 = await iterator.next();
      current2 = await iterator2.next();
    }
  } else {
    while (current1.done !== true && current2.done !== true) {
      if (current1.value !== current2.value) {
        return false;
      }
      current1 = await iterator.next();
      current2 = await iterator2.next();
    }
  }

  return current1.done === true && current2.done === true;
}
