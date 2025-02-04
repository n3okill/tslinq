import type { IAsyncEnumerable } from "../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";
import { elementAt, elementAtAsync } from "./elementAt.ts";

export function elementAtOrDefault<T>(
  enumerable: IEnumerable<T>,
  defaultValue: T,
  index: number,
): T {
  try {
    return elementAt(enumerable, index);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}

export async function elementAtOrDefaultAsync<T>(
  enumerable: IAsyncEnumerable<T>,
  defaultValue: T,
  index: number,
): Promise<T> {
  try {
    return await elementAtAsync(enumerable, index);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return defaultValue;
  }
}
