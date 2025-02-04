import { AsyncEnumerable } from "../async-enumerable.ts";
import { Enumerable } from "../enumerable.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

export function chunk<T>(
  enumerable: IEnumerable<T>,
  size: number,
): IEnumerable<Array<T>> {
  validateArgumentOrThrow(size, "size", "number");
  if (size <= 0) {
    throw new RangeError("'index' is out of range");
  }

  const chunks = [];
  let chunk = [];
  let i = 0;
  for (const item of enumerable.enumeratorSource) {
    chunk.push(item);
    i++;
    if (i >= size) {
      chunks.push(chunk);
      chunk = [];
      i = 0;
    }
  }
  if (chunk.length > 0) {
    chunks.push(chunk);
  }

  return new Enumerable<Array<T>>(chunks);
}

export function chunkAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  size: number,
): IAsyncEnumerable<Array<T>> {
  validateArgumentOrThrow(size, "size", "number");
  if (size <= 0) {
    throw new RangeError("'index' is out of range");
  }

  async function* generator(iterator: AsyncIterator<T>) {
    let current = await iterator.next();
    while (current.done !== true) {
      const chunk = [current.value];
      let i = 1;
      current = await iterator.next();
      while (current.done !== true && i < size) {
        chunk.push(current.value);
        i++;
        current = await iterator.next();
      }
      yield chunk;
    }
  }
  return new AsyncEnumerable<Array<T>>(generator(enumerable.iterator()));
}
