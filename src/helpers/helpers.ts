import { InvalidArgumentException } from "../exceptions/InvalidArgumentException.ts";
import { NotIterableException } from "../exceptions/NotIterableException.ts";
import { isAsyncIterable, isIterable, isNullOrUndefined } from "./utils.ts";

/**
 * 53bit Hash function, fast and with decent collision resistance
 * @param str - a string to hash
 * @param seed - a seed
 * @returns the string hash value
 *
 * Credits to https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
 */
export function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export const hash = cyrb53;

export function tryWrapper(fn: CallableFunction) {
  try {
    return [undefined, fn()];
  } catch (err) {
    return [err];
  }
}

export function validateArgumentOrThrow(
  argument: unknown,
  name: string,
  type: string,
) {
  if (isNullOrUndefined(argument) || typeof argument !== type) {
    throw new InvalidArgumentException(`'${name}' is invalid`);
  }
}

export function validateIterableOrThrow(
  argument: unknown,
  name: string,
  checkAsyncIterable = false,
) {
  if (isNullOrUndefined(argument)) {
    throw new NotIterableException(`${name}`);
  }
  if (checkAsyncIterable) {
    if (!isAsyncIterable(argument) && !isIterable(argument)) {
      throw new NotIterableException(name);
    }
  } else {
    if (!isIterable(argument)) {
      throw new NotIterableException(name);
    }
  }
}
