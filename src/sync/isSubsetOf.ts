import { validateIterableOrThrow } from "../helpers/helpers.ts";
import { isIterable } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { AllIterable } from "../types/other.ts";

export function isSubsetOf<T>(
  enumerable: IEnumerable<T>,
  second: Iterable<T>,
): boolean {
  validateIterableOrThrow(second, "second");

  const tempSet = new Set<T>();

  const enumIterator = enumerable.iterator();
  let currentEnum = enumIterator.next();
  loop1: while (currentEnum.done !== true) {
    if (tempSet.has(currentEnum.value)) {
      currentEnum = enumIterator.next();
      continue loop1;
    }
    tempSet.add(currentEnum.value);
    const secIterator = second[Symbol.iterator]();
    let currentSec = secIterator.next();
    while (currentSec.done !== true) {
      if (currentSec.value === currentEnum.value) {
        currentEnum = enumIterator.next();
        continue loop1;
      }
      currentSec = secIterator.next();
    }
    return false;
  }
  return true;
}

export async function isSubsetOfAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  second: AllIterable<T>,
): Promise<boolean> {
  validateIterableOrThrow(second, "second", true);

  const tempSet = new Set<T>();
  const enumIterator = enumerable.iterator();
  let currentEnum = await enumIterator.next();
  loop1: while (currentEnum.done !== true) {
    if (tempSet.has(currentEnum.value)) {
      currentEnum = await enumIterator.next();
      continue loop1;
    }
    tempSet.add(currentEnum.value);
    const secIterator = isIterable(second)
      ? second[Symbol.iterator]()
      : second[Symbol.asyncIterator]();
    let currentSec = await secIterator.next();
    while (currentSec.done !== true) {
      if (currentSec.value === currentEnum.value) {
        currentEnum = await enumIterator.next();
        continue loop1;
      }
      currentSec = await secIterator.next();
    }
    return false;
  }
  return true;
}
