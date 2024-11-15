//import { Type } from "@n3okill/utils";

import { isAsyncIterable, isBoolean, isNull, isNumber, isObject, isString, isSymbol } from "./utils";

export const getDefaultValue = <T>(val: unknown): T =>
  isNumber(val)
    ? (0 as unknown as T)
    : isString(val)
      ? ("" as unknown as T)
      : isBoolean(val)
        ? (false as unknown as T)
        : isSymbol(val)
          ? (Symbol() as unknown as T)
          : isObject(val)
            ? isNull(val)
              ? (null as unknown as T)
              : (undefined as unknown as T)
            : (undefined as unknown as T);

export const asyncIteratorAsArray = async <T>(iterator: AsyncIterator<T>): Promise<Array<T>> => {
  const result = [];
  let current = await iterator.next();
  while (current.done !== true) {
    result.push(current.value);
    current = await iterator.next();
  }
  return result;
};

export const asAsyncIterable = <T>(obj: Iterable<T> | AsyncIterable<T>): AsyncIterable<T> => {
  if (isAsyncIterable(obj)) {
    return obj as AsyncIterable<T>;
  }
  return new AsyncIterableObj(obj as Iterable<T>);
};

class AsyncIterableObj<T> implements AsyncIterable<T> {
  constructor(private readonly _data: Iterable<T>) {}
  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    const iterator = this._data[Symbol.iterator]();
    let current = iterator.next();
    while (current.done !== true) {
      yield current.value;
      current = iterator.next();
    }
  }
}
/*
export const asIterableObj = async <T>(obj: AsyncIterable<T>): Promise<Array<T>> => {
    const result = [];
    const iterator = obj[Symbol.asyncIterator]();
    let current = await iterator.next();
    while (current.done !== true) {
        result.push(current.value);
        current = await iterator.next();
    }
    return result;
}*/
