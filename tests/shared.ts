import {
  EqualityComparer,
  EqualityComparerAsync,
} from "../src/comparer/equality-comparer.ts";

export class AnagramEqualityComparer extends EqualityComparer<string> {
  equals(x: string, y: string): boolean {
    if (!x || !y) return x === y;
    return x.split("").sort().join("") === y.split("").sort().join("");
  }
}

export class CaseInsensitiveEqualityComparer extends EqualityComparer<string> {
  public equals(x: string, y: string): boolean {
    if (x.toLowerCase() === y.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export class WeakEqualityComparer<T> implements EqualityComparer<T> {
  equals(x: T, y: T) {
    return x == y;
  }
}

export class WeakEqualityComparerAsync<T> implements EqualityComparerAsync<T> {
  async equals(x: T, y: T) {
    return Promise.resolve(x == y);
  }
}

export class Product {
  name: string;
  code: number;
  constructor(name: string, code: number) {
    this.name = name;
    this.code = code;
  }
}

export class ProductEqualityComparer extends EqualityComparer<Product> {
  equals(x?: Product, y?: Product): boolean {
    return x?.code === y?.code && x?.name === y?.name;
  }
}

export class ProductEqualityComparerAsync extends EqualityComparerAsync<Product> {
  async equals(x?: Product, y?: Product): Promise<boolean> {
    return Promise.resolve(x?.code === y?.code && x?.name === y?.name);
  }
}

export interface Person {
  id?: number;
  name?: string;
  age?: number;
}

export class PersonComparer extends EqualityComparer<Person> {
  equals(x?: Person, y?: Person): boolean {
    if (!x || !y) return x === y;
    return x.id === y.id;
  }
}
