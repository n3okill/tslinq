import { isUndefined } from "../helpers/utils.ts";
import { AsyncEnumerable, Enumerable } from "../internal.ts";
import type { IEnumerable } from "../types/enumerable.interface.ts";

class ShuffleEnumerable<T> extends Enumerable<T> {
  #_buffer?: Array<T>;
  #_map?: Array<number>;

  override [Symbol.iterator](): Iterator<T> {
    if (isUndefined(this.#_buffer)) {
      this.#_buffer = Array.from(this._source);
      if (this.#_buffer.length !== 0) {
        this.#_map = shuffleMap(this.#_buffer);
      } else {
        return {
          next: () => {
            return { done: true, value: undefined };
          },
        };
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iterator = this.#_map![Symbol.iterator]();
    let current;
    return {
      next: () => {
        current = iterator.next();
        if (current.done !== true) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return { done: false, value: this.#_buffer![current.value] };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

export function shuffle<T>(enumerable: Enumerable<T>): IEnumerable<T> {
  return new ShuffleEnumerable(enumerable);
}

function shuffleMap<T>(buffer: Array<T>): Array<number> {
  let length = buffer.length;
  const map = Enumerable.range(0, length).toArray();
  while (--length) {
    const j = Math.floor(Math.random() * (length + 1));
    // eslint-disable-next-line security/detect-object-injection
    [map[length], map[j]] = [map[j], map[length]];
  }
  return map;
}

class ShuffleAsyncEnumerable<T> extends AsyncEnumerable<T> {
  #_buffer?: Array<T>;
  #_map?: Array<number>;

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    let _state = 0;
    let iterator: ArrayIterator<number>;
    let current;
    return {
      next: async () => {
        switch (_state) {
          case 0:
            if (isUndefined(this.#_buffer)) {
              this.#_buffer = await this._createBuffer();
              if (this.#_buffer.length !== 0) {
                this.#_map = shuffleMap(this.#_buffer);
              }
            }
            if (this.#_buffer.length === 0) {
              _state = -1;
              return { done: true, value: undefined };
            }
            _state = 1;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            iterator = this.#_map![Symbol.iterator]();
          // eslint-disable-next-line no-fallthrough
          case 1:
            current = iterator.next();
            if (current.done !== true) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return { done: false, value: this.#_buffer![current.value] };
            }
            _state = -1;
        }
        return { done: true, value: undefined };
      },
    };
  }

  private async _createBuffer(): Promise<Array<T>> {
    const buffer = [];
    for await (const item of this._source) {
      buffer.push(item);
    }
    return buffer;
  }
}

export function shuffleAsync<T>(
  enumerable: AsyncEnumerable<T>,
): AsyncEnumerable<T> {
  return new ShuffleAsyncEnumerable(enumerable);
}
