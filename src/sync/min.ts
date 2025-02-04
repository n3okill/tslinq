import { InvalidElementsCollection } from "../exceptions/InvalidElementsCollection.ts";
import { NoElementsException } from "../exceptions/NoElementsException.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import { Comparer, ComparerAsync } from "../comparer/comparer.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import { isUndefined } from "../helpers/utils.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

export function min<T>(
  enumerable: IEnumerable<T>,
  selectorOrComparer?: TKeySelector<T, number> | Comparer<T>,
): number | T {
  if (selectorOrComparer instanceof Comparer) {
    if (selectorOrComparer !== Comparer.default) {
      return minComparer(enumerable, selectorOrComparer);
    }
  } else if (!isUndefined(selectorOrComparer)) {
    validateArgumentOrThrow(selectorOrComparer, "transformer", "function");
  }
  selectorOrComparer = (selectorOrComparer ??
    ((x: T) => x as number)) as TKeySelector<T, number>;
  const iterator = enumerable.iterator();
  let current = iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  let key = selectorOrComparer(current.value);
  if (typeof key !== "number" || isNaN(key)) {
    throw new InvalidElementsCollection(
      `Items must be of type number in order to use min() - Got '${key}' transformed from '${current.value}'`,
    );
  }
  let result = key;
  current = iterator.next();
  while (current.done !== true) {
    key = selectorOrComparer(current.value);
    if (typeof key !== "number" || isNaN(key)) {
      throw new InvalidElementsCollection(
        `Items must be of type number in order to use min() - Got '${key}' transformed from '${current.value}'`,
      );
    }
    if (key < result) {
      result = key;
    }
    current = iterator.next();
  }
  return result;
}

function minComparer<T>(enumerable: IEnumerable<T>, comparer: Comparer<T>): T {
  const iterator = enumerable.iterator();
  let current = iterator.next();
  let result = current.value;
  current = iterator.next();

  while (current.done !== true) {
    if (comparer.compare(current.value, result) < 0) {
      result = current.value;
    }
    current = iterator.next();
  }

  return result;
}

export async function minAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  selectorOrComparer?: TKeySelectorAsync<T, number> | ComparerAsync<T>,
): Promise<number | T> {
  if (
    selectorOrComparer instanceof Comparer ||
    selectorOrComparer instanceof ComparerAsync
  ) {
    if (
      selectorOrComparer !== Comparer.default &&
      selectorOrComparer !== ComparerAsync.default
    ) {
      return minComparerAsync(enumerable, selectorOrComparer);
    }
  } else if (!isUndefined(selectorOrComparer)) {
    validateArgumentOrThrow(selectorOrComparer, "transformer", "function");
  }
  selectorOrComparer = (selectorOrComparer ??
    ((x: T) => x as number)) as TKeySelectorAsync<T, number>;
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  let key = await selectorOrComparer(current.value);
  if (typeof key !== "number" || isNaN(key)) {
    throw new InvalidElementsCollection(
      `Items must be of type number in order to use min() - Got '${key}' transformed from '${current.value}'`,
    );
  }
  let result = key;
  current = await iterator.next();
  while (current.done !== true) {
    key = await selectorOrComparer(current.value);
    if (typeof key !== "number" || isNaN(key)) {
      throw new InvalidElementsCollection(
        `Items must be of type number in order to use min() - Got '${key}' transformed from '${current.value}'`,
      );
    }
    if (key < result) {
      result = key;
    }
    current = await iterator.next();
  }
  return result;
}

async function minComparerAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  comparer: ComparerAsync<T> | Comparer<T>,
): Promise<T> {
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  let result = current.value;
  current = await iterator.next();

  while (current.done !== true) {
    if ((await comparer.compare(current.value, result)) < 0) {
      result = current.value;
    }
    current = await iterator.next();
  }

  return result;
}
