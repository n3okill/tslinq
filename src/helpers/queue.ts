class Node<T> {
  #_next?: Node<T>;
  #_data: T;
  constructor(data: T) {
    this.#_data = data;
  }
  get data(): T {
    return this.#_data;
  }
  get next(): Node<T> | undefined {
    return this.#_next;
  }
  set next(nextNode: Node<T> | undefined) {
    this.#_next = nextNode;
  }
}

export class Queue<T> implements Iterable<T> {
  #_head?: Node<T>;
  #_lenght = 0;
  #_tail?: Node<T>;

  [Symbol.iterator](): Iterator<T> {
    if (!this.#_head) {
      return {
        next: () => {
          return { done: true, value: undefined };
        },
      };
    }
    let current = {
      next: this.#_head,
    } as Node<T> | undefined;
    return {
      next: () => {
        current = current?.next;
        if (current) {
          return { done: false, value: current.data };
        }
        return { done: true, value: undefined };
      },
    };
  }

  get length(): number {
    return this.#_lenght;
  }

  public enqueue(elem: T) {
    const node = new Node<T>(elem);
    if (!this.#_head) {
      this.#_head = node;
      this.#_tail = node;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#_tail!.next = node;
      this.#_tail = node;
    }
    this.#_lenght++;
  }
  public dequeue(): T {
    const elem = this.#_head?.data as T;
    this.#_head = this.#_head?.next;
    this.#_lenght--;
    return elem;
  }
}
