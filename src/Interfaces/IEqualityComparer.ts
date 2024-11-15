export abstract class IEqualityComparer<T> {
  abstract Equals(x: T, y: T): boolean;
}

export class DefaultEqualityComparer<T> extends IEqualityComparer<T> {
  public Equals(x: T, y: T): boolean {
    if (x === y) {
      return true;
    }
    return false;
  }
}

export abstract class IAsyncEqualityComparer<T> {
  abstract Equals(x: T, y: T): Promise<boolean>;
}
export class DefaultAsyncEqualityComparer<T> extends IAsyncEqualityComparer<T> {
  public Equals(x: T, y: T): Promise<boolean> {
    if (x === y) {
      return new Promise(() => true);
    }
    return new Promise(() => false);
  }
}
