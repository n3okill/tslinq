import { validateIterableOrThrow } from "../helpers/helpers.ts";
import { isIterable } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { AllIterable } from "../types/other.ts";

export function isSupersetOf<T>(
  enumerable: IEnumerable<T>,
  second: Iterable<T>,
): boolean {
  validateIterableOrThrow(second, "second");

  const tempSet = new Set<T>();

  const secIterator = second[Symbol.iterator]();
  let currentSec = secIterator.next();
  loop1: while (currentSec.done !== true) {
    if (tempSet.has(currentSec.value)) {
      currentSec = secIterator.next();
      continue loop1;
    }
    tempSet.add(currentSec.value);
    const enumIterator = enumerable.iterator();
    let currentEnum = enumIterator.next();
    while (currentEnum.done !== true) {
      if (currentSec.value === currentEnum.value) {
        currentSec = secIterator.next();
        continue loop1;
      }
      currentEnum = enumIterator.next();
    }
    return false;
  }
  return true;
}

export async function isSupersetOfAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  second: AllIterable<T>,
): Promise<boolean> {
  validateIterableOrThrow(second, "second", true);

  const tempSet = new Set<T>();

  const secIterator = isIterable(second)
    ? second[Symbol.iterator]()
    : second[Symbol.asyncIterator]();
  let currentSec = await secIterator.next();
  loop1: while (currentSec.done !== true) {
    if (tempSet.has(currentSec.value)) {
      currentSec = await secIterator.next();
      continue loop1;
    }
    tempSet.add(currentSec.value);
    const enumIterator = enumerable.iterator();
    let currentEnum = await enumIterator.next();
    while (currentEnum.done !== true) {
      if (currentSec.value === currentEnum.value) {
        currentSec = await secIterator.next();
        continue loop1;
      }
      currentEnum = await enumIterator.next();
    }
    return false;
  }
  return true;
}
