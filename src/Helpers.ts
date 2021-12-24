import { Type } from "@n3okill/utils";

export const getDefaultValue = <T>(val: unknown): T => {
    switch (Type.getEnumType(val)) {
        case Type.EnumTypes.Number:
            return 0 as unknown as T;
        case Type.EnumTypes.String:
            return "" as unknown as T;
        case Type.EnumTypes.Boolean:
            return false as unknown as T;
        case Type.EnumTypes.Symbol:
            return Symbol() as unknown as T;
        case Type.EnumTypes.Object:
            return (null === val ? null : undefined) as unknown as T;
        default:
            return undefined as unknown as T;
    }
};

export const asyncIteratorAsArray = async <T>(iterator: AsyncIterator<T>): Promise<Array<T>> => {
    const result = [];
    let current = await iterator.next();
    while (current.done !== true) {
        result.push(current.value);
        current = await iterator.next();
    }
    return result;
};

export const asAsyncIterable = <T>(obj: Iterable<T> | AsyncIterable<T>): AsyncIterable<T> => {
    if (Type.isAsyncIterable(obj)) {
        return obj as AsyncIterable<T>;
    }
    return new AsyncIterableObj(obj as Iterable<T>);
};

class AsyncIterableObj<T> implements AsyncIterable<T> {
    constructor(private readonly _data: Iterable<T>) {}
    // eslint-disable-next-line @typescript-eslint/require-await
    async *[Symbol.asyncIterator](): AsyncGenerator<T> {
        const iterator = this._data[Symbol.iterator]();
        let current = iterator.next();
        while (current.done !== true) {
            yield current.value;
            current = iterator.next();
        }
    }
}
/*
export const asIterableObj = async <T>(obj: AsyncIterable<T>): Promise<Array<T>> => {
    const result = [];
    const iterator = obj[Symbol.asyncIterator]();
    let current = await iterator.next();
    while (current.done !== true) {
        result.push(current.value);
        current = await iterator.next();
    }
    return result;
}*/
