import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { OfType } from "../types/infer.ts";

class OfTypeEnumerable<T, TType> extends Enumerable<TType> {
  readonly #_typeCheck: (x: T) => boolean;
  constructor(source: Enumerable<T>, type: TType) {
    super(source as unknown as Enumerable<TType>);
    this.#_typeCheck =
      type === null
        ? (x: T) => x === null
        : typeof type === "string"
          ? (x: T) => typeof x === type
          : (x: T) => x instanceof (type as never);
  }

  override [Symbol.iterator](): Iterator<TType> {
    const iterator = (this._source as Enumerable<T>).iterator();
    let current;
    return {
      next: () => {
        current = iterator.next();
        while (current.done !== true) {
          if (this.#_typeCheck(current.value)) {
            return { done: false, value: current.value as unknown as TType };
          }
          current = iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function ofType<T, TType extends OfType>(
  enumerable: Enumerable<T>,
  type: TType,
): Enumerable<TType> {
  return new OfTypeEnumerable<T, TType>(enumerable, type);
}

class OfTypeAsyncEnumerable<T, TType> extends AsyncEnumerable<TType> {
  readonly #_typeCheck: (x: T) => boolean;
  constructor(source: AsyncEnumerable<T>, type: TType) {
    super(source as unknown as AsyncEnumerable<TType>);
    this.#_typeCheck =
      type === null
        ? (x: T) => x === null
        : typeof type === "string"
          ? (x: T) => typeof x === type
          : (x: T) => x instanceof (type as never);
  }

  override [Symbol.asyncIterator](): AsyncIterator<TType> {
    const iterator = (this._source as AsyncEnumerable<T>).iterator();
    let current;
    return {
      next: async () => {
        current = await iterator.next();
        while (current.done !== true) {
          if (this.#_typeCheck(current.value)) {
            return { done: false, value: current.value as unknown as TType };
          }
          current = await iterator.next();
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function ofTypeAsync<T, TType extends OfType>(
  enumerable: AsyncEnumerable<T>,
  type: TType,
): AsyncEnumerable<TType> {
  return new OfTypeAsyncEnumerable<T, TType>(enumerable, type);
}
