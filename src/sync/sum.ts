import type { IEnumerable } from "../types/enumerable.interface.ts";
import { NoElementsException } from "../exceptions/NoElementsException.ts";
import type { TParamPromise } from "../types/other.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { InvalidElementsCollection } from "../exceptions/InvalidElementsCollection.ts";
import { isUndefined } from "../helpers/utils.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

export function sum<T, TResult>(
  enumerable: IEnumerable<T>,
  selector?: (element: T) => TResult,
): TResult {
  if (!isUndefined(selector)) {
    validateArgumentOrThrow(selector, "selector", "function");
  }
  selector = selector ?? ((element: T) => element as unknown as TResult);
  const iterator = enumerable.iterator();
  let current = iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }

  let result = selector(current.value);
  const firstType = typeof result;
  if (firstType !== "number" && firstType !== "string") {
    throw new InvalidElementsCollection(
      `Items must be of type number or string in order to use sum() - Got '${result}' transformed from '${current.value}'`,
    );
  }
  current = iterator.next();
  while (current.done !== true) {
    const toSum = selector(current.value);
    if (typeof toSum !== firstType) {
      throw new InvalidElementsCollection(
        `Items must be of type number or string in order to use sum() - Got '${result}' transformed from '${current.value}'`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result += toSum as any;
    current = iterator.next();
  }
  return result;
}

export async function sumAsync<T, TResult>(
  enumerable: IAsyncEnumerable<T>,
  selector?: (element: T) => TParamPromise<TResult>,
): Promise<TResult> {
  if (!isUndefined(selector)) {
    validateArgumentOrThrow(selector, "selector", "function");
  }
  selector = selector ?? ((element: T) => element as unknown as TResult);

  const iterator = enumerable.iterator();
  let current = await iterator.next();
  if (current.done) {
    throw new NoElementsException();
  }

  let result = await selector(current.value);
  const firstType = typeof result;
  if (firstType !== "number" && firstType !== "string") {
    throw new InvalidElementsCollection(
      `Items must be of type number or string in order to use sum() - Got '${result}' transformed from '${current.value}'`,
    );
  }
  current = await iterator.next();
  while (current.done !== true) {
    const toSum = await selector(current.value);
    if (typeof toSum !== firstType) {
      throw new InvalidElementsCollection(
        `Items must be of type number or string in order to use sum() - Got '${result}' transformed from '${current.value}'`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result += toSum as any;
    current = await iterator.next();
  }
  return result;
}
