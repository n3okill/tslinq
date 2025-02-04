import { NoElementsException } from "../exceptions/NoElementsException.ts";
import { NotNumberException } from "../exceptions/NotNumberEception.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type { TParamPromise } from "../types/other.ts";

export function average<T>(
  enumerable: IEnumerable<T>,
  selector: (x: T) => number,
): number {
  validateArgumentOrThrow(selector, "selector", "function");
  if (enumerable.enumeratorSource[Symbol.iterator]().next().done) {
    throw new NoElementsException();
  }
  let sum = 0;
  let count = 0;
  for (const item of enumerable.enumeratorSource) {
    const toSum = selector(item);
    if (typeof toSum !== "number") {
      throw new NotNumberException(`${item} transformation into ${toSum}`);
    }
    sum += toSum;
    count++;
  }
  return sum / count;
}

export async function averageAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  selector: (x: T) => TParamPromise<number>,
): Promise<number> {
  validateArgumentOrThrow(selector, "selector", "function");
  if ((await enumerable.iterator().next()).done) {
    throw new NoElementsException();
  }
  let sum = 0;
  let count = 0;
  for await (const item of enumerable.enumeratorSource) {
    const toSum = await selector(item);
    if (typeof toSum !== "number") {
      throw new NotNumberException(`${item} transformation into ${toSum}`);
    }
    sum += toSum;
    count++;
  }
  return sum / count;
}
