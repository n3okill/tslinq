import type { IEnumerable } from "../types/enumerable.interface.ts";
import { last, lastAsync } from "./last.ts";
import type { TParamPromise } from "../types/other.ts";
import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";

export function lastOrDefault<T>(
  enumerable: IEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => boolean,
): T {
  try {
    return last(enumerable, predicate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}

export async function lastOrDefaultAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  defaultValue: T,
  predicate?: (x: T) => TParamPromise<boolean>,
): Promise<T> {
  try {
    return await lastAsync(enumerable, predicate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}
