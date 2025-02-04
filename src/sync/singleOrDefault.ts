import { MoreThanOneElementSatisfiesCondition } from "../exceptions/MoreThanOneElementSatisfiesCondition.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import { single, singleAsync } from "./single.ts";
import type { TParamPromise } from "../types/other.ts";

export function singleOrDefault<T>(
  enumerable: IEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => boolean,
): T {
  try {
    return single(enumerable, predicate);
  } catch (e) {
    if (!(e instanceof MoreThanOneElementSatisfiesCondition)) {
      return defaultValue;
    }
    throw e;
  }
}

export async function singleOrDefaultAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  try {
    return await singleAsync(enumerable, predicate);
  } catch (e) {
    if (!(e instanceof MoreThanOneElementSatisfiesCondition)) {
      return defaultValue;
    }
    throw e;
  }
}
