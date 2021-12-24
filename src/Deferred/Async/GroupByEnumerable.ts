import { EnumerableAsync, Types, Helpers, Enumerable } from "../../internal";
import { Type } from "@n3okill/utils";

export class GroupByEnumerable<T, TKey, TResult, TElement> extends EnumerableAsync<TResult> {
    constructor(source: EnumerableAsync<T>, private _keySelector: Types.TKeySelectorAsync<T, TKey>, private _elementSelector: Types.TElementSelectorAsync<T, TElement>, private _resultSelector: Types.TResultSelectorAsync<TKey, TElement, TResult>, private _comparer: Types.TIAsyncEqualityComparer<TKey>) {
        super(source as unknown as EnumerableAsync<TResult>);
    }

    override [Symbol.asyncIterator](): AsyncIterator<TResult> {
        return this._GroupBy();
    }

    private async *_GroupBy() {
        const iterator = (await this._getKeyedMap())[Symbol.iterator]();
        let current = iterator.next();
        const isResultSelectorAsync = Type.isAsyncFunction(this._resultSelector);
        while (current.done !== true) {
            if (isResultSelectorAsync) {
                yield await this._resultSelector(current.value[0], new EnumerableAsync(Helpers.asAsyncIterable(current.value[1])));
            } else {
                yield this._resultSelector(current.value[0], new Enumerable(current.value[1]));
            }
            current = iterator.next();
        }
    }

    private async _getKeyedMap(): Promise<Map<TKey, TElement[]>> {
        const map = new Map<TKey, Array<TElement>>();
        const iterator = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
        let current = await iterator.next();
        loop1: while (current.done !== true) {
            const key = await this._keySelector(current.value);
            const iteratorMap = map[Symbol.iterator]();
            let currentMap = iteratorMap.next();
            while (currentMap.done !== true) {
                if (await this._comparer.Equals(currentMap.value[0], key)) {
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
}
