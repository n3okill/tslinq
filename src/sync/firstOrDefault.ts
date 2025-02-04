import type { IEnumerable } from "../types/enumerable.interface.ts";
import { first, firstAsync } from "./first.ts";
import type { TParamPromise } from "../types/other.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";

export function firstOrDefault<T>(
  enumerable: IEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => boolean,
): T {
  try {
    return first(enumerable, predicate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}

export async function firstOrDefaultAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  try {
    return await firstAsync(enumerable, predicate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}
