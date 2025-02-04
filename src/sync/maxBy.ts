import { InvalidElementsCollection } from "../exceptions/InvalidElementsCollection.ts";
import { NoElementsException } from "../exceptions/NoElementsException.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import { Comparer, ComparerAsync } from "../comparer/comparer.ts";
import type { TKeySelector, TKeySelectorAsync } from "../types/selectors.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

export function maxBy<T>(
  enumerable: IEnumerable<T>,
  keySelector: TKeySelector<T, number>,
  comparer?: Comparer<number>,
): T {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  const iterator = enumerable.iterator();
  let current = iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  let key = keySelector(current.value);
  if (typeof key !== "number") {
    throw new InvalidElementsCollection(
      `keySelector must return a number in order to use maxBy() - Got ${key} from '${current.value}'`,
    );
  } else {
    let result = current.value;

    if (typeof comparer === "undefined") {
      while (current.done !== true) {
        const nextKey = keySelector(current.value);
        if (typeof nextKey !== "number") {
          throw new InvalidElementsCollection(
            `keySelector must return a number in order to use maxBy() - Got ${key} from '${current.value}'`,
          );
        }
        if (nextKey > key) {
          key = nextKey;
          result = current.value;
        }
        current = iterator.next();
      }
      return result;
    } else {
      while (current.done !== true) {
        const nextKey = keySelector(current.value);
        if (comparer.compare(nextKey, key) > 0) {
          result = current.value;
        }
        current = iterator.next();
      }

      return result;
    }
  }
}

export async function maxByAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, number>,
  comparer: ComparerAsync<number> = ComparerAsync.default,
): Promise<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }
  let key = await keySelector(current.value);
  if (typeof key !== "number") {
    throw new InvalidElementsCollection(
      `keySelector must return a number in order to use maxBy() - Got ${key} from '${current.value}'`,
    );
  } else {
    let result = current.value;

    if (comparer === ComparerAsync.default) {
      while (current.done !== true) {
        const nextKey = await keySelector(current.value);
        if (typeof key !== "number") {
          throw new InvalidElementsCollection(
            `keySelector must return a number in order to use maxBy() - Got ${nextKey} from '${current.value}'`,
          );
        }
        if (nextKey > key) {
          key = nextKey;
          result = current.value;
        }
        current = await iterator.next();
      }
      return result;
    } else {
      while (current.done !== true) {
        const nextKey = await keySelector(current.value);
        if ((await comparer.compare(nextKey, key)) > 0) {
          result = current.value;
        }
        current = await iterator.next();
      }

      return result;
    }
  }
}
