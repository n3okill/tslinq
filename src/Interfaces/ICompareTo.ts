/*interface ICompareTo<V> {
    CompareTo: (x: V, y: V) => number;
}

export const isICompareTo =<V>(obj: unknown): obj is ICompareTo<V> => { 
    return (<ICompareTo<V>>obj).CompareTo !== undefined;
}*/
export abstract class ICompareTo<T> {
    abstract CompareTo(x: T, y: T): number;
}

export class DefaultCompareTo<A = number> extends ICompareTo<A> {
    public CompareTo(x: A, y: A): -1 | 0 | 1 {
        if (x > y) {
            return 1;
        } else if (x < y) {
            return -1;
        } else {
            return 0;
        }
    }
}

/*
interface IAsyncCompareTo<V> {
    CompareTo: (x: V, y: V) => Promise<number>;
}

export const isIAsyncCompareTo = <V>(obj: unknown): obj is IAsyncCompareTo<V> => {
    return (<IAsyncCompareTo<V>>obj).CompareTo !== undefined;
}
*/
export abstract class IAsyncCompareTo<T> {
    abstract CompareTo(x: T, y: T): Promise<number>;
}

export class DefaultAsyncCompareTo<A = number> extends IAsyncCompareTo<A> {
    public async CompareTo(x: A, y: A): Promise<-1 | 0 | 1> {
        if (x > y) {
            return Promise.resolve(1);
        } else if (x < y) {
            return Promise.resolve(-1);
        } else {
            return Promise.resolve(0);
        }
    }
}
