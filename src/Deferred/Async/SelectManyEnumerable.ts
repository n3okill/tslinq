import { EnumerableAsync, Types } from "../../internal";
import { Type } from "@n3okill/utils";

export class SelectManyEnumerable<T, TResult, TCollection> extends EnumerableAsync<TResult> {
    constructor(source: EnumerableAsync<T>, private readonly _selector: Types.SelectManySelectorAsync<T, TCollection>, private readonly _resultSelector: Types.SelectManyResultSelectorAsync<T, TCollection, TResult>) {
        super(source as unknown as EnumerableAsync<TResult>);
    }
    override [Symbol.asyncIterator](): AsyncIterator<TResult> {
        return this._SelectMany();
    }
    private async *_SelectMany() {
        const iterator = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
        let current = await iterator.next();
        let index = 0;
        while (current.done !== true) {
            const selector = await this._selector(current.value, index);
            const iteratorSelector = Type.isAsyncIterable(selector) ? (selector as unknown as AsyncIterable<TCollection>)[Symbol.asyncIterator]() : (selector as unknown as Iterable<TCollection>)[Symbol.iterator](); //(await this._selector(current.value, index))[Symbol.asyncIterator]();
            let currentSelector = await iteratorSelector.next();
            while (currentSelector.done !== true) {
                yield await this._resultSelector(current.value, currentSelector.value);
                currentSelector = await iteratorSelector.next();
            }
            index++;
            current = await iterator.next();
        }
    }
}
