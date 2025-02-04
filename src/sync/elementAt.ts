import { OutOfRangeException } from "../exceptions/OutOfRangeException.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function elementAt<T>(enumerable: IEnumerable<T>, index: number): T {
  validateArgumentOrThrow(index, "index", "number");
  if (index < 0) {
    throw new OutOfRangeException("index");
  }
  if (Array.isArray(enumerable.enumeratorSource)) {
    if (index >= enumerable.enumeratorSource.length) {
      throw new OutOfRangeException("index");
    }

    return enumerable.enumeratorSource.at(index);
  }
  for (const item of enumerable.enumeratorSource) {
    if (index-- === 0) {
      return item;
    }
  }

  throw new OutOfRangeException("index");
}

export async function elementAtAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  index: number,
): Promise<T> {
  validateArgumentOrThrow(index, "index", "number");
  if (index < 0) {
    throw new OutOfRangeException("index");
  }
  for await (const item of enumerable.enumeratorSource) {
    if (index-- === 0) {
      return item;
    }
  }

  throw new OutOfRangeException("index");
}
