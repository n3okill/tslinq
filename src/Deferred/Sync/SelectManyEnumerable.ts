import { Enumerable, Types } from "../../internal";

export class SelectManyEnumerable<T, TResult, TCollection> extends Enumerable<TResult> {
    constructor(source: Enumerable<T>, private readonly _selector: Types.SelectManySelector<T, TCollection>, private readonly _resultSelector: Types.SelectManyResultSelector<T, TCollection, TResult>) {
        super(source as unknown as Enumerable<TResult>);
    }
    override [Symbol.iterator](): Iterator<TResult> {
        return this._SelectMany();
    }
    private *_SelectMany() {
        const iterator = this._source[Symbol.iterator]() as Iterator<T>;
        let current = iterator.next();
        let index = 0;
        while (current.done !== true) {
            const iteratorSelector = this._selector(current.value, index)[Symbol.iterator]();
            let currentSelector = iteratorSelector.next();
            while (currentSelector.done !== true) {
                yield this._resultSelector(current.value, currentSelector.value);
                currentSelector = iteratorSelector.next();
            }
            index++;
            current = iterator.next();
        }
    }
}
