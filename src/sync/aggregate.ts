import { NoElementsException } from "../exceptions/NoElementsException.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import type {
  AggregateFunctionType,
  AggregateFunctionTypeAsync,
  AggregateResultType,
  AggregateResultTypeAsync,
} from "../types/aggregate.ts";
import { isUndefined, isFunction, isFunctionType } from "../helpers/utils.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import { validateArgumentOrThrow } from "../helpers/helpers.ts";

export function aggregate<T, TAccumulate, TResult>(
  enumerable: IEnumerable<T>,
  func: AggregateFunctionType<T, T | TAccumulate>,
  seed?: TAccumulate,
  resultSelector?: AggregateResultType<TAccumulate, TResult>,
): TResult {
  validateArgumentOrThrow(func, "func", "function");
  if (Array.isArray(enumerable.enumeratorSource)) {
    if (!isUndefined(seed)) {
      const result = (enumerable.enumeratorSource as Array<T>).reduce(
        func,
        seed,
      );
      return isFunction(resultSelector)
        ? resultSelector(result as TAccumulate)
        : (result as unknown as TResult);
    }
    if (!enumerable.enumeratorSource.length) {
      throw new NoElementsException();
    }
    const result = (enumerable.enumeratorSource as Array<T>).reduce(
      func as never,
    );
    return isFunction(resultSelector)
      ? resultSelector(result as unknown as TAccumulate)
      : (result as unknown as TResult);
  }
  const iterator = enumerable.iterator();
  let current = iterator.next();
  let result;
  if (isUndefined(seed)) {
    if (current.done) {
      throw new NoElementsException();
    }
    result = current.value;
    current = iterator.next();
  } else {
    result = seed;
  }
  while (current.done !== true) {
    result = func(result, current.value);
    current = iterator.next();
  }
  return isFunction(resultSelector)
    ? resultSelector(result as TAccumulate)
    : (result as unknown as TResult);
}

export async function aggregateAsync<T, TAccumulate, TResult>(
  enumerable: IAsyncEnumerable<T>,
  func: AggregateFunctionTypeAsync<T, T | TAccumulate>,
  seed?: TAccumulate,
  resultSelector?: AggregateResultTypeAsync<TAccumulate, TResult>,
): Promise<TResult> {
  validateArgumentOrThrow(func, "func", "function");
  const iterator = enumerable.iterator();
  let current = await iterator.next();
  let result;
  if (isUndefined(seed)) {
    if (current.done) {
      throw new NoElementsException();
    }
    result = current.value as unknown as TAccumulate;
    current = await iterator.next();
  } else {
    result = seed;
  }
  while (current.done !== true) {
    result = (await func(result, current.value)) as TAccumulate;
    current = await iterator.next();
  }
  return isFunctionType(resultSelector)
    ? await resultSelector(result as TAccumulate)
    : (result as unknown as TResult);
}
