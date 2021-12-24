import { EnumerableAsync, Helpers, Interfaces, Types } from "../../internal";

class Grouping<TKey, T> extends EnumerableAsync<T> implements Interfaces.IAsyncGrouping<TKey, T> {
    constructor(source: AsyncIterable<T>, public Key: TKey) {
        super(source);
    }
}

export class GroupByGroupedEnumerable<T, TKey, TElement> extends EnumerableAsync<Grouping<TKey, TElement>> {
    constructor(first: EnumerableAsync<T>, private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>, private readonly _elementSelector: Types.TElementSelectorAsync<T, TElement>, private readonly _comparer: Interfaces.IEqualityComparer<TKey>) {
        super(first as unknown as EnumerableAsync<Grouping<TKey, TElement>>);
    }
    override [Symbol.asyncIterator](): AsyncIterator<Grouping<TKey, TElement>> {
        return this._GroupByGrouped();
    }

    private async *_GroupByGrouped(): AsyncGenerator<Grouping<TKey, TElement>> {
        const iterator = (await this._getKeyedMap())[Symbol.iterator]();
        let current = iterator.next();
        while (current.done !== true) {
            yield new Grouping(Helpers.asAsyncIterable(current.value[1]), current.value[0]);
            current = iterator.next();
        }
    }

    private async _getKeyedMap(): Promise<Map<TKey, Array<TElement>>> {
        const map = new Map<TKey, Array<TElement>>();
        const iterator = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
        let current = await iterator.next();
        loop1: while (current.done !== true) {
            const key = await this._keySelector(current.value);
            const iteratorMap = map[Symbol.iterator]();
            let currentMap = iteratorMap.next();
            while (currentMap.done !== true) {
                if (this._comparer.Equals(currentMap.value[0], key)) {
                    currentMap.value[1].push(await this._elementSelector(current.value));
                    current = await iterator.next();
                    continue loop1;
                }
                currentMap = iteratorMap.next();
            }
            map.set(key, [await this._elementSelector(current.value)]);
            current = await iterator.next();
        }
        return map;
    }

    public override async toMap<K, V>(): Promise<Map<K, Array<V>>> {
        const result = new Map<K, Array<V>>();
        for await (const value of this) {
            result.set(value.Key as unknown as K, (await Helpers.asyncIteratorAsArray(value[Symbol.asyncIterator]())) as unknown as Array<V>);
        }
        return result;
    }

    public override async toArray<K>(): Promise<Array<K>> {
        return Array.from(await this.toMap()) as unknown as Array<K>;
    }
}
